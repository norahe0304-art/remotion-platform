# prompts/

Curated prompt library for Remotion ideation and production.

SOP 手册入口：`/Users/nora/Desktop/pinpoint migration/remotion-platform/README.md`

## Fields required per prompt

- `id`
- `title`
- `tags`
- `prompt`
- `source_url`
- `author`
- `usage_note`

## Commands

```bash
npm run prompts:list
npm run prompts:search -- terminal
npm run prompts:sync
npm run prompts:sync:since
npm run prompts:app
npm run prompts:open
```

## Sources

- https://www.remotion.dev/prompts
- https://github.com/manalkaff/remotion-prompts

## Scheduled sync

- GitHub Actions workflow: `.github/workflows/prompts-sync.yml`
- Runs daily (UTC), uses incremental sync + retry, and can be triggered manually via `workflow_dispatch`.

## Browser app

- Start: `npm run prompts:app`
- Start and auto-open browser: `npm run prompts:open`
- Open: `http://localhost:4180/app/`
- Features: beginner-friendly 3-step guidance, source/tag filter, keyword search, preview modal, copy prompt, copy AI template, source link.

### Non-technical user flow

1. Open the page and choose a source (Official / Community).
2. Click a tag to narrow down style/category.
3. Click "Preview" to inspect full prompt.
4. Click "Copy AI Template" (or "Copy") and paste into Codex / Claude Code.
