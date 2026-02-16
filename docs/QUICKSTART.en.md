# Quick Start (1 minute)

Audience: Non-technical users who want to start a new video fast.

Language: [English](./QUICKSTART.en.md) | [简体中文](./QUICKSTART.md)

## Do these 7 steps

1. Open terminal and enter project
```bash
git clone https://github.com/norahe0304-art/remotion-platform.git
cd remotion-platform
```

2. Initialize workflow (works for both existing and new project)
```bash
npm run workflow:init
```

3. If prompted, follow `create-video` to create a new project (new users).

4. Sync latest prompts (incremental)
```bash
npm run prompts:sync:since
```

5. Open prompt web picker
```bash
npm run prompts:app
```

6. In the web app:
- choose source (official/community)
- click `Preview`
- click `Copy AI Template`

7. Send template to AI and fill 3 fields
- brand/theme
- duration
- target audience

Input location: Fill these fields in the AI chat message after pasting the template. The web app is for selection/copy only.

## Success criteria

- You get an executable scene-by-scene implementation plan
- You know which assets are required
- You can hand off to engineering/AI for v1 production
