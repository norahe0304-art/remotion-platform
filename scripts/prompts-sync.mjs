import { readFile, writeFile } from 'node:fs/promises';

const OUT_FILE = new URL('../prompts/index.json', import.meta.url);

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const uniqueById = (items) => {
  const map = new Map();
  for (const item of items) {
    if (!item?.id) continue;
    map.set(item.id, item);
  }
  return [...map.values()];
};

const normalize = (item) => ({
  id: item.id,
  title: item.title,
  tags: Array.isArray(item.tags) ? item.tags : [],
  prompt: item.prompt,
  source_url: item.source_url,
  author: item.author,
  usage_note: item.usage_note,
});

const fetchText = async (url) => {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'remotion-platform-prompts-sync',
      accept: 'text/html,application/json,text/plain,*/*',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
};

const syncFromRemotionDev = async () => {
  const sourceUrl = 'https://www.remotion.dev/prompts';
  const html = await fetchText(sourceUrl);
  const results = [];

  const cardRegex = /href="\/(?:prompts|p)\/([^"]+)"[^>]*>[\s\S]{0,300}?<[^>]+>([^<]{4,120})<\//g;
  let m;
  const seen = new Set();
  while ((m = cardRegex.exec(html)) !== null) {
    const slug = (m[1] || '').trim();
    const title = (m[2] || '').trim();
    if (!slug || !title) continue;
    const id = `remotion-dev-${toSlug(slug)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    results.push(
      normalize({
        id,
        title,
        tags: ['remotion-dev', 'community'],
        prompt: `Source card: ${title}. Open the source page to copy full prompt details.`,
        source_url: `https://www.remotion.dev/prompts/${slug}`,
        author: 'remotion-community',
        usage_note: 'Review original page for exact prompt text and licensing context.',
      })
    );
  }

  return results;
};

const syncFromManalkaffRepo = async () => {
  const sourceUrl = 'https://raw.githubusercontent.com/manalkaff/remotion-prompts/main/README.md';
  const md = await fetchText(sourceUrl);
  const results = [];

  const lineRegex = /^[-*]\s+\[(.+?)\]\((https?:\/\/[^)]+)\)/gm;
  let m;
  const seen = new Set();
  while ((m = lineRegex.exec(md)) !== null) {
    const title = (m[1] || '').trim();
    const link = (m[2] || '').trim();
    if (!title || !link) continue;
    const id = `manalkaff-${toSlug(title)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    results.push(
      normalize({
        id,
        title,
        tags: ['manalkaff', 'community'],
        prompt: `Community prompt entry: ${title}. Open source URL for complete prompt body.`,
        source_url: link,
        author: 'manalkaff-community',
        usage_note: 'Verify source terms before direct commercial reuse.',
      })
    );
  }

  return results;
};

const main = async () => {
  const existing = JSON.parse(await readFile(OUT_FILE, 'utf8'));
  const existingManual = (existing || []).filter((item) =>
    !String(item.id || '').startsWith('remotion-dev-') && !String(item.id || '').startsWith('manalkaff-')
  );

  const pulled = [];
  const failures = [];

  try {
    const items = await syncFromRemotionDev();
    pulled.push(...items);
  } catch (err) {
    failures.push(`remotion.dev: ${err.message}`);
  }

  try {
    const items = await syncFromManalkaffRepo();
    pulled.push(...items);
  } catch (err) {
    failures.push(`manalkaff repo: ${err.message}`);
  }

  const merged = uniqueById([...existingManual, ...pulled]).sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(OUT_FILE, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

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
