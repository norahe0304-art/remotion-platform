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

## What init gives you

- A working Remotion project
- Workflow guide: `.nora-remotion-workflow/WORKFLOW.md`
- Starter controls (`schema + defaultProps`) in `src/NoraWorkflow/*`
- Starter composition in `src/Root.tsx`

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
