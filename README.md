# remotion-platform

Create a Remotion video fast with one command + a prompt picker.

## 1) Start your project

```bash
npx -y @norahe/remotion-workflow init --project-name my-video
cd my-video
npm install
npm run dev
```

`my-video` is just an example name. Use any name you want.
If your project name contains spaces, wrap it in quotes.
No template selection required. This command creates the preset Nora setup directly.

## What init gives you

- A working Remotion project
- Workflow guide: `.nora-remotion-workflow/WORKFLOW.md`
- Starter controls (`schema + defaultProps`) in `src/NoraWorkflow/*`
- Starter composition in `src/Root.tsx`
- In Studio, select `NoraWorkflow-Starter` to see the full right-side Props panel

## 2) Pick a prompt

Open: `https://prompts-mauve.vercel.app/app/`

Choose either:
- Start from scratch (blank guide)
- Use a community/official prompt (then customize)

Prompt commands:

```bash
# Local prompt app (if needed)
npm run prompts:app

# Prompt maintenance (maintainers)
npm run prompts:sync:since
npm run prompts:sync
```

## 3) Generate your first draft

Copy prompt -> paste into AI chat -> ask for first draft in your project.

## 4) Iterate and export

Review timing, audio mix, copy, and visuals.
Iterate scene by scene, then export final.

## 5) Template Schema (B2B)

The `templates/schema/` directory contains a structured template format designed for B2B video generation.

### Schema overview

Each template JSON file declares:
- `variables` — replaceable content slots (text, colors, images, fonts) with defaults
- `scenes` — ordered sequence of timed scenes with elements and transitions
- `animations` — reusable animation presets (spring, interpolate) referenced by name
- `brandPresets` — one-click brand themes that override variable defaults
- `category` — use-case tag: `b2b-showcase`, `social-ads`, `product-launch`, `explainer`, `testimonial`, `event-promo`

### Example templates

| File | Category | Description |
|------|----------|-------------|
| `templates/schema/examples/b2b-showcase.json` | b2b-showcase | SaaS hero video with headline, subline, CTA |
| `templates/schema/examples/social-ads.json` | social-ads | Vertical ad for Instagram/TikTok |
| `templates/schema/examples/product-launch.json` | product-launch | Multi-scene launch announcement |

### Quick start

1. Copy an example from `templates/schema/examples/`
2. Replace `variables` defaults with your content
3. Pick a `brandPresets` entry or define your own
4. Validate against `templates/schema/template-schema.json`