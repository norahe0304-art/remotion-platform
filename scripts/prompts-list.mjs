import { readFile } from 'node:fs/promises';

const raw = await readFile(new URL('../prompts/index.json', import.meta.url), 'utf8');
const items = JSON.parse(raw);
for (const item of items) {
  console.log(`- ${item.id} | ${item.title} | tags=${item.tags.join(',')}`);
}
