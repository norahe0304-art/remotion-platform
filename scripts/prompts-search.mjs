import { readFile } from 'node:fs/promises';

const term = (process.argv[2] ?? '').toLowerCase();
if (!term) {
  console.error('Usage: npm run prompts:search -- <term>');
  process.exit(1);
}

const raw = await readFile(new URL('../prompts/index.json', import.meta.url), 'utf8');
const items = JSON.parse(raw);
const results = items.filter((item) => {
  return (
    item.title.toLowerCase().includes(term) ||
    item.tags.some((tag) => tag.toLowerCase().includes(term)) ||
    item.prompt.toLowerCase().includes(term)
  );
});

for (const item of results) {
  console.log(`- ${item.id} | ${item.title}`);
  console.log(`  source: ${item.source_url}`);
}

if (results.length === 0) {
  console.log('No prompt matched.');
}
