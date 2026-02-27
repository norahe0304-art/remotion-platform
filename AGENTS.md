# remotion-platform/
> L1 | Parent: /Users/nora/Desktop/pinpoint migration/AGENTS.md

<directory>
packages/remotion-controls/ - Shared controls schema and timeline computation helpers
packages/remotion-prompts/ - Installable prompt dataset and input-guide helpers
packages/remotion-styles/ - Shared branding and motion style system
packages/remotion-workflow/ - CLI workflow initializer for existing/new Remotion projects
templates/remotion-template-nora/ - Starter template consuming shared packages
templates/schema/ - Template schema definition (JSON Schema) and B2B example templates
prompts/ - Prompt library and searchable metadata index
scripts/ - Prompt sync/list/search/app server scripts
</directory>

Rules:
- Keep packages focused and framework-agnostic where possible.
- `remotion-styles` owns brand look and motion tokens, not story presets.
- Prompt entries must include source attribution fields.
- Top-level user documentation is English-only in `README.md`.
