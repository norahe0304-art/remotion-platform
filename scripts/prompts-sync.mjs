import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const OUT_FILE = new URL('../prompts/index.json', import.meta.url);
const ROOT = 'https://www.remotion.dev';
const args = new Set(process.argv.slice(2));
const isSinceMode = args.has('--since');

const stripTags = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const decodeHtml = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const toSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const normalize = (item) => ({
  id: item.id,
  title: item.title,
  tags: Array.isArray(item.tags) ? item.tags : [],
  prompt: item.prompt,
  source_url: item.source_url,
  author: item.author,
  usage_note: item.usage_note,
});
const uniqueById = (items) => {
  const map = new Map();
  for (const item of items) {
    if (!item?.id) continue;
    map.set(item.id, item);
  }
  return [...map.values()];
};
const unique = (items) => [...new Set(items)];

const fetchText = (url) => {
  try {
    return execFileSync('curl', ['-sSL', url], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    throw new Error(`curl failed for ${url}`);
  }
};

const parseRemotionGalleryPages = () => {
  try {
    const sitemap = fetchText(`${ROOT}/sitemap.xml`);
    const urls = [...sitemap.matchAll(/<loc>(https:\/\/www\.remotion\.dev\/prompts\/[^<]+)<\/loc>/g)]
      .map((m) => m[1].replace(/\/$/, ''))
      .filter((url) => {
        const slug = url.replace(`${ROOT}/prompts/`, '');
        if (!slug || slug === 'submit' || slug === 'history') return false;
        if (/^\d+$/.test(slug)) return false;
        return true;
      });
    if (urls.length > 0) return unique(urls);
  } catch {
    // fallback to crawl mode
  }

  const queue = [`${ROOT}/prompts`];
  const seenPages = new Set();
  const promptUrls = new Set();

  while (queue.length > 0) {
    const pageUrl = queue.shift();
    if (!pageUrl || seenPages.has(pageUrl)) continue;
    seenPages.add(pageUrl);

    const html = fetchText(pageUrl);
    const hrefs = [...html.matchAll(/href=(?:"|')([^"']+)(?:"|')/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (!href.startsWith('/prompts')) continue;
      if (href === '/prompts' || href === '/prompts/' || /^\/prompts\/\d+$/.test(href)) {
        const full = `${ROOT}${href.replace(/\/$/, '')}`;
        if (!seenPages.has(full)) queue.push(full);
        continue;
      }
      const slug = href.replace(/^\/prompts\//, '').replace(/\/$/, '');
      if (!slug || slug === 'submit' || slug === 'history') continue;
      if (/^\d+$/.test(slug)) continue;
      promptUrls.add(`${ROOT}/prompts/${slug}`);
    }
  }

  return unique([...promptUrls]);
};

const syncFromRemotionDev = ({ knownIds = new Set(), sinceMode = false } = {}) => {
  const promptUrls = parseRemotionGalleryPages();
  const results = [];

  for (const url of promptUrls) {
    const slug = url.replace(`${ROOT}/prompts/`, '').replace(/\/$/, '');
    const id = `remotion-dev-${toSlug(slug)}`;
    if (sinceMode && knownIds.has(id)) continue;

    try {
      const html = fetchText(url);
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const authorMatch = html.match(/Prompted by[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
      const promptMatch = html.match(/<h2[^>]*>\s*Prompt\s*<\/h2>[\s\S]*?<pre[^>]*>([\s\S]*?)<\/pre>/i);

      const title = decodeHtml(stripTags(titleMatch?.[1] || '')).trim();
      const prompt = decodeHtml((promptMatch?.[1] || '').trim());
      if (!title || !prompt) continue;

      results.push(
        normalize({
          id,
          title,
          tags: ['remotion-dev', 'official'],
          prompt,
          source_url: url,
          author: decodeHtml(stripTags(authorMatch?.[1] || 'remotion-community')),
          usage_note: 'Source from remotion.dev prompt gallery.',
        })
      );
    } catch {
      // Skip broken entry and continue
    }
  }
  return results;
};

const parseMankaffPrompt = (md) => {
  const block = md.match(/##\s+Prompt[\s\S]*?```(?:\w+)?\n([\s\S]*?)```/i);
  if (block?.[1]) return block[1].trim();
  return '';
};

const syncFromManalkaffRepo = ({ knownIds = new Set(), sinceMode = false } = {}) => {
  const sourceReadme = fetchText('https://raw.githubusercontent.com/manalkaff/remotion-prompts/main/README.md');
  const results = [];
  const rows = sourceReadme.split('\n').filter((line) => line.startsWith('| ['));

  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 5) continue;

    const nameMatch = cells[0].match(/^\[(.+?)\]\((.+?)\)$/);
    if (!nameMatch) continue;

    const title = nameMatch[1].trim();
    const relPath = nameMatch[2].trim().replace(/\/$/, '');
    const id = `manalkaff-${toSlug(relPath)}`;
    if (sinceMode && knownIds.has(id)) continue;

    const desc = cells[1] || '';
    const category = toSlug(cells[2] || 'community');
    const author = (cells[3].match(/^\[(.+?)\]\((.+?)\)$/)?.[1] || 'community').replace(/^@/, '');
    const promptReadme = `https://raw.githubusercontent.com/manalkaff/remotion-prompts/main/${relPath}/README.md`;
    const sourceUrl = `https://github.com/manalkaff/remotion-prompts/tree/main/${relPath}`;

    let prompt = desc;
    try {
      const md = fetchText(promptReadme);
      prompt = parseMankaffPrompt(md) || desc;
    } catch {
      // keep description fallback
    }

    results.push(
      normalize({
        id,
        title,
        tags: ['manalkaff', 'community', category],
        prompt,
        source_url: sourceUrl,
        author,
        usage_note: 'Source from manalkaff/remotion-prompts repository.',
      })
    );
  }

  return results;
};

const main = async () => {
  const existing = JSON.parse(await readFile(OUT_FILE, 'utf8'));
  const existingManual = (existing || []).filter((item) => {
    const id = String(item.id || '');
    return !id.startsWith('remotion-dev-') && !id.startsWith('manalkaff-');
  });
  const existingSource = (existing || []).filter((item) => {
    const id = String(item.id || '');
    return id.startsWith('remotion-dev-') || id.startsWith('manalkaff-');
  });
  const knownSourceIds = new Set(existingSource.map((item) => item.id));

  const pulled = [];
  const failures = [];

  try {
    pulled.push(...syncFromRemotionDev({ knownIds: knownSourceIds, sinceMode: isSinceMode }));
  } catch (err) {
    failures.push(`remotion.dev: ${err.message}`);
  }

  try {
    pulled.push(...syncFromManalkaffRepo({ knownIds: knownSourceIds, sinceMode: isSinceMode }));
  } catch (err) {
    failures.push(`manalkaff repo: ${err.message}`);
  }

  const merged = uniqueById(
    isSinceMode ? [...existingManual, ...existingSource, ...pulled] : [...existingManual, ...pulled]
  ).sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(OUT_FILE, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

  console.log(`Mode: ${isSinceMode ? 'incremental (--since)' : 'full'}`);
  console.log(`Synced prompts: ${pulled.length}`);
  console.log(`Total prompts: ${merged.length}`);

  if (failures.length > 0) {
    console.warn('Partial failures:');
    for (const msg of failures) console.warn(`- ${msg}`);
    process.exitCode = 1;
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
