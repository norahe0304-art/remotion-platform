# remotion-platform

Remotion production platform for building shippable videos fast (Prompt library + branding styles + timeline controls).

Language: [English](./README.md) | [简体中文](./README.zh-CN.md)

## Who this is for

- Marketing/Ops: Start a new video request without coding.
- Design/Content: Pick style, pacing, and messaging.
- Engineering/AI operators: Turn requirements into a Remotion output.

## One-line SOP (new video)

Pick prompt -> Copy AI template -> Fill business inputs -> Generate v1 -> Sync audio/video -> Export final.

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

```bash
git clone https://github.com/norahe0304-art/remotion-platform.git
cd remotion-platform
npm install
```

If you only want prompt selection (no code changes), go to Step 2.

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

After copying AI template, fill at least:
- Brand/theme (e.g. Pronetx dark-tech)
- Video length (e.g. 60s)
- Target audience (e.g. AWS migration PM)

Recommended extras:
- Target channel (X / YouTube / website)
- Mandatory lines (hard copy)
- Asset paths (logo, icon, bgm, vo)

---

## 4. Create a new video project (engineering)

If you already have an existing project (for example `pinpoint migration/video`), iterate there directly.

Suggested flow:
1. Copy from `templates/remotion-template-nora`
2. Install deps
3. Start Remotion Studio
4. Create a no-VO rough cut first to validate visual rhythm

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
```

---

## Platform modules

- `packages/remotion-controls`: shared props schema + VO timeline helpers + duration normalization
- `packages/remotion-styles`: branding tokens + motion tokens + primitives
- `templates/remotion-template-nora`: starter project wired to shared packages
- `prompts`: curated prompt library with attribution + browser app
