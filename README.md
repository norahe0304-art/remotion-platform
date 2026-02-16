# remotion-platform

Remotion production platform for building shippable videos fast (Prompt library + branding styles + timeline controls).

## Who this is for

- Marketing/Ops: Start a new video request without coding.
- Design/Content: Pick style, pacing, and messaging.
- Engineering/AI operators: Turn requirements into a Remotion output.

## One-line SOP (new video)

Run workflow init -> Pick prompt -> Copy template -> Fill inputs in AI chat -> Generate v1 -> Sync A/V -> Export final.

Quick Start (1 minute): [EN](./docs/QUICKSTART.en.md) | [ZH](./docs/QUICKSTART.md)

---

## Workspace map

- `prompts/`: Prompt index, sync scripts, and browser picker
- `docs/`: Non-technical quickstart playbooks
- `packages/remotion-controls`: VO timeline, scene durations, props schema
- `packages/remotion-styles`: Brand tokens + motion tokens
- `templates/remotion-template-nora`: Starter template

---

## 0. First-time setup

Start here (no repo clone):

```bash
npx -y @norahe/remotion-workflow init --project-name my-video
cd my-video
npm install
npm run dev
```

---

## 1. Sync prompts (daily incremental)

```bash
npm run prompts:sync:since
```

Notes:
- `prompts:sync:since`: incremental sync (recommended)
- `prompts:sync`: full re-fetch (use when source structure changes)

---

## 2. Open the non-technical web picker

```bash
npm run prompts:app
```

Open in browser: `http://localhost:4180/app/`

In the app:
1. Choose source (Official / Community)
2. Filter by tags and keywords
3. Click `Preview`
4. Click `Copy AI Template`

---

## 3. Standard input for a new video request

Where to input: Paste the copied AI template into your AI chat (Codex / ChatGPT / Claude), then edit the placeholders there. Do not input inside the prompt web app.

After copying AI template, fill at least:
- Brand/theme (e.g. Pronetx dark-tech)
- Video length (e.g. 60s)
- Target audience (e.g. AWS migration PM)

Recommended extras:
- Target channel (X / YouTube / website)
- Mandatory lines (hard copy)
- Asset paths (logo, icon, bgm, vo)

---

## 4. Create a Remotion project (default path)

With `workflow init`, behavior is automatic:
- If current directory is already a Remotion project: initialize workflow files in place.
- If not: create a new official Remotion project via `create-video`, then initialize workflow files.
- In both paths: inject starter Studio controls (`schema + defaultProps`) into `src/NoraWorkflow/*` and register a `NoraWorkflow-Starter` composition in `src/Root.tsx`.

Manual default path (if needed):

```bash
npx create-video@latest my-video
cd my-video
npm install
npm run start
```

Then paste your copied AI template into Codex / ChatGPT / Claude and ask it to implement inside this project.

Optional advanced path:
- If your team wants shared brand tokens and controls out of the box, use `templates/remotion-template-nora`.

---

## 5. Production flow (8 steps)

1. Lock script (`voText` + `sceneTexts`)
2. Generate VO (same voice, speed, level)
3. Align scene durations
4. Fine-tune A/V sync (`voNudges` or timeline helper)
5. Mix BGM/VO (avoid pumping)
6. Improve transition breathing room
7. Full pass review scene-by-scene
8. Export final (1080p + version naming)

---

## 6. Quality gates (must pass before export)

- A/V sync: no early starts, no cut tails
- Level consistency: VO stable, BGM not overpowering
- Rhythm consistency: no abrupt transitions
- Copy consistency: on-screen text aligns with VO
- Visual consistency: brand color/font/motion style aligned

---

## 7. Delivery checklist

- Final video file (with version)
- VO script + timing config
- Prompt source + final AI template used
- Change notes vs previous version

---

## 8. Troubleshooting

- `Could not resolve host`: DNS issue in current execution environment, run on host/outside sandbox
- `localhost refused to connect`: Studio not running, restart dev server
- Image load errors: verify `public` path and static asset references
- VO tail cut: increase scene duration or delay transition

---

## Command quick reference

```bash
npm run prompts:list
npm run prompts:search -- terminal
npm run prompts:sync:since
npm run prompts:sync
npm run prompts:app
npm run workflow:init
```

## Distribution model

- End users (no repo clone): `npx @norahe/remotion-workflow init`
- Existing projects: run the same command in project root.
- New projects: CLI creates an official Remotion project, then initializes workflow.

---

## Platform modules

- `packages/remotion-controls`: shared props schema + VO timeline helpers + duration normalization
- `packages/remotion-styles`: branding tokens + motion tokens + primitives
- `templates/remotion-template-nora`: starter project wired to shared packages
- `prompts`: curated prompt library with attribution + browser app
