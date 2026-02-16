/**
 * [INPUT]: promptIndex dataset from local package data source.
 * [OUTPUT]: list/search/get helpers and blank/prompted AI template builders.
 * [POS]: public API for @nora/remotion-prompts consumption across projects.
 * [PROTOCOL]: update this header when code changes, then check AGENTS.md
 */

import {promptIndex} from './data.mjs';

const normalizedIndex = promptIndex.map((value) => ({
  id: String(value.id),
  title: String(value.title),
  tags: Array.isArray(value.tags) ? value.tags.map((tag) => String(tag)) : [],
  prompt: String(value.prompt),
  source_url: String(value.source_url),
  author: String(value.author),
  usage_note: String(value.usage_note),
}));

export const listPrompts = () => normalizedIndex;

export const findPromptById = (id) => {
  return normalizedIndex.find((record) => record.id === id) ?? null;
};

export const searchPrompts = (query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return normalizedIndex;
  return normalizedIndex.filter((record) => {
    const haystack = `${record.title} ${record.tags.join(' ')} ${record.prompt}`.toLowerCase();
    return haystack.includes(q);
  });
};

export const buildBlankInputGuide = () => {
  return [
    'Please create a Remotion video plan from scratch using best practices.',
    '',
    '[Project bootstrap - default]',
    '- npx create-video@latest my-video',
    '- cd my-video',
    '- npm install',
    '- npm run start',
    '',
    '[Goal]',
    '- Restate the goal in 1-2 sentences.',
    '- Ask no more than 3 critical questions if details are missing.',
    '',
    '[Implementation Requirements]',
    '- Propose a practical scene-by-scene structure.',
    '- Suggest transitions/motion style and pacing.',
    '- Provide required assets checklist (logo, image, audio, font, icon).',
    '- Provide concrete next commands to run.',
    '',
    '[Inputs to fill]',
    '- Brand/Theme: <fill here>',
    '- Video Duration: <fill here>',
    '- Target Audience: <fill here>',
    '- Target Channel: <fill here>',
    '- Mandatory Lines: <fill here>',
  ].join('\n');
};

export const buildPromptInputGuide = (record) => {
  return [
    'Please build an executable Remotion implementation plan based on the prompt below.',
    '',
    '[Project bootstrap - default]',
    '- npx create-video@latest my-video',
    '- cd my-video',
    '- npm install',
    '- npm run start',
    '',
    '[Goal]',
    '- Restate your understanding of the goal in 1-2 sentences.',
    '- If information is missing, ask no more than 3 critical questions.',
    '',
    '[Implementation Requirements]',
    '- Provide a practical scene-by-scene breakdown.',
    '- Recommend key animation and transition choices (readability first).',
    '- Provide an asset checklist (image, audio, font, icon).',
    '- Provide concrete next commands to run.',
    '',
    '[Replaceable Inputs]',
    '- Brand/Theme: <fill here>',
    '- Video Duration: <fill here>',
    '- Target Audience: <fill here>',
    '',
    '[Prompt Title]',
    record?.title || '',
    '',
    '[Prompt Text]',
    record?.prompt || '',
    '',
    '[Source]',
    record?.source_url || '',
  ].join('\n');
};
