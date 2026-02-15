# prompts/

Curated prompt library for Remotion ideation and production.

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
```

## Sources

- https://www.remotion.dev/prompts
- https://github.com/manalkaff/remotion-prompts

## Scheduled sync

- GitHub Actions workflow: `.github/workflows/prompts-sync.yml`
- Runs every Monday (UTC) and can be triggered manually via `workflow_dispatch`.
