#!/usr/bin/env node
/**
 * [INPUT]: process args, filesystem state, and optional create-video scaffolding.
 * [OUTPUT]: initialized workflow guide files in an existing or newly created project.
 * [POS]: CLI entrypoint for @norahe/remotion-workflow package.
 * [PROTOCOL]: update this header when code changes, then check AGENTS.md
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {spawnSync} from 'node:child_process';

const HELP = `
Usage:
  remotion-workflow init [--project-name my-video]

Behavior:
  - If current directory already looks like a Remotion project, initialize workflow files there.
  - Otherwise, scaffold a new Remotion project with create-video and initialize workflow files.
`;

const args = process.argv.slice(2);
const command = args[0];

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
};

const ensureDir = (target) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, {recursive: true});
  }
};

const writeIfMissing = (filePath, content) => {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
};

const upsertPackageJsonDependency = (projectDir, depName, version) => {
  const packagePath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(packagePath)) return false;
  const raw = fs.readFileSync(packagePath, 'utf8');
  const pkg = JSON.parse(raw);
  const inDeps = Boolean(pkg.dependencies?.[depName]);
  const inDevDeps = Boolean(pkg.devDependencies?.[depName]);
  if (inDeps || inDevDeps) return false;
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies[depName] = version;
  const sortedDeps = Object.keys(pkg.dependencies)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = pkg.dependencies[key];
      return acc;
    }, {});
  pkg.dependencies = sortedDeps;
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return true;
};

const buildStarterSchemaTs = () => {
  return [
    '/**',
    ' * [INPUT]: zod runtime and Remotion props panel validation.',
    ' * [OUTPUT]: starter schema for visual/audio/timing controls.',
    ' * [POS]: Nora workflow starter schema for quick project bootstrapping.',
    ' * [PROTOCOL]: update this header when code changes, then check AGENTS.md',
    ' */',
    '',
    "import {z} from 'zod';",
    '',
    'export const starterSchema = z.object({',
    '  visual: z.object({',
    '    headingScalePct: z.number().int().min(80).max(130),',
    '    bodyScalePct: z.number().int().min(80).max(130),',
    '  }),',
    '  audio: z.object({',
    '    enableVoiceover: z.boolean(),',
    '    enableMusic: z.boolean(),',
    '    musicVolumePct: z.number().int().min(0).max(100),',
    '    voiceVolumePct: z.number().int().min(0).max(200),',
    '  }),',
    '  timing: z.object({',
    '    totalFrames: z.number().int().min(300).max(3600),',
    '    scene1Frames: z.number().int().min(60).max(1800),',
    '  }),',
    '});',
    '',
    'export type StarterProps = z.infer<typeof starterSchema>;',
  ].join('\n');
};

const buildStarterDefaultPropsTs = () => {
  return [
    '/**',
    ' * [INPUT]: StarterProps type from starter schema.',
    ' * [OUTPUT]: default props values for the starter composition.',
    ' * [POS]: single source of truth for initial right-panel values.',
    ' * [PROTOCOL]: update this header when code changes, then check AGENTS.md',
    ' */',
    '',
    "import type {StarterProps} from './schema';",
    '',
    'export const starterDefaultProps: StarterProps = {',
    '  visual: {',
    '    headingScalePct: 100,',
    '    bodyScalePct: 100,',
    '  },',
    '  audio: {',
    '    enableVoiceover: true,',
    '    enableMusic: true,',
    '    musicVolumePct: 20,',
    '    voiceVolumePct: 100,',
    '  },',
    '  timing: {',
    '    totalFrames: 1800,',
    '    scene1Frames: 360,',
    '  },',
    '};',
  ].join('\n');
};

const buildStarterCompositionTsx = () => {
  return [
    '/**',
    ' * [INPUT]: starter props from schema/defaultProps.',
    ' * [OUTPUT]: minimal, editable scene proving controls are wired.',
    ' * [POS]: first-touch composition for non-technical users in Studio.',
    ' * [PROTOCOL]: update this header when code changes, then check AGENTS.md',
    ' */',
    '',
    "import React from 'react';",
    "import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';",
    "import type {StarterProps} from './schema';",
    '',
    'export const NoraWorkflowStarter: React.FC<StarterProps> = (props) => {',
    '  const frame = useCurrentFrame();',
    '  const fade = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});',
    '  const headingSize = 78 * (props.visual.headingScalePct / 100);',
    '  const bodySize = 34 * (props.visual.bodyScalePct / 100);',
    '',
    '  return (',
    '    <AbsoluteFill',
    '      style={{',
    "        background: 'radial-gradient(circle at 25% 20%, rgba(32,114,255,0.20), transparent 35%), #040c1d',",
    "        color: '#f4f7ff',",
    "        fontFamily: 'Inter, system-ui, sans-serif',",
    "        opacity: fade,",
    "        justifyContent: 'center',",
    "        alignItems: 'center',",
    "        textAlign: 'center',",
    '      }}',
    '    >',
    '      <div style={{padding: "0 120px"}}>',
    '        <h1 style={{fontSize: headingSize, margin: 0, lineHeight: 1.1}}>Nora Workflow Starter</h1>',
    '        <p style={{fontSize: bodySize, marginTop: 24, opacity: 0.88}}>',
    '          Edit props on the right panel: visual / audio / timing. This is your default schema.',
    '        </p>',
    '      </div>',
    '    </AbsoluteFill>',
    '  );',
    '};',
  ].join('\n');
};

const ensureStarterFiles = (projectDir) => {
  const srcDir = path.join(projectDir, 'src');
  const starterDir = path.join(srcDir, 'NoraWorkflow');
  ensureDir(starterDir);
  writeIfMissing(path.join(starterDir, 'schema.ts'), `${buildStarterSchemaTs()}\n`);
  writeIfMissing(path.join(starterDir, 'defaultProps.ts'), `${buildStarterDefaultPropsTs()}\n`);
  writeIfMissing(path.join(starterDir, 'StarterComposition.tsx'), `${buildStarterCompositionTsx()}\n`);
};

const ensureStarterInRoot = (projectDir) => {
  const rootTsxPath = path.join(projectDir, 'src', 'Root.tsx');
  if (!fs.existsSync(rootTsxPath)) return false;
  const raw = fs.readFileSync(rootTsxPath, 'utf8');
  if (raw.includes('NoraWorkflowStarter')) return false;

  const importLines = [
    "import {NoraWorkflowStarter} from './NoraWorkflow/StarterComposition';",
    "import {starterSchema} from './NoraWorkflow/schema';",
    "import {starterDefaultProps} from './NoraWorkflow/defaultProps';",
  ];
  let next = raw;

  for (const line of importLines) {
    if (!next.includes(line)) {
      next = `${line}\n${next}`;
    }
  }

  const compositionBlock = [
    '      <Composition',
    '        id="NoraWorkflow-Starter"',
    '        component={NoraWorkflowStarter}',
    '        durationInFrames={starterDefaultProps.timing.totalFrames}',
    '        fps={30}',
    '        width={1920}',
    '        height={1080}',
    '        schema={starterSchema}',
    '        defaultProps={starterDefaultProps}',
    '      />',
  ].join('\n');

  if (next.includes('</>')) {
    next = next.replace('</>', `${compositionBlock}\n    </>`);
  } else {
    return false;
  }

  fs.writeFileSync(rootTsxPath, next, 'utf8');
  return true;
};

const isRemotionProject = (cwd) => {
  const packagePath = path.join(cwd, 'package.json');
  const remotionConfigPathTs = path.join(cwd, 'remotion.config.ts');
  const remotionConfigPathJs = path.join(cwd, 'remotion.config.js');
  if (fs.existsSync(remotionConfigPathTs) || fs.existsSync(remotionConfigPathJs)) return true;
  if (!fs.existsSync(packagePath)) return false;
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const deps = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
    return Boolean(deps.remotion || deps['@remotion/cli']);
  } catch {
    return false;
  }
};

const createProjectIfNeeded = (cwd, projectName) => {
  if (isRemotionProject(cwd)) return cwd;
  const safeName = projectName || 'my-video';
  console.log(`[workflow] No Remotion project found in ${cwd}`);
  console.log(`[workflow] Creating a new Remotion project: ${safeName}`);
  const result = spawnSync(
    'npx',
    ['create-video@latest', safeName],
    {stdio: 'inherit', cwd}
  );
  if (result.status !== 0) {
    console.error('[workflow] Failed to create Remotion project via create-video.');
    process.exit(result.status || 1);
  }
  return path.join(cwd, safeName);
};

const buildGuide = (projectName) => {
  return [
    '# Nora Remotion Workflow',
    '',
    `Project: ${projectName}`,
    '',
    '1) Prompt selection',
    '- Open prompt browser: https://prompts-mauve.vercel.app/app/',
    '- Copy either `Copy AI Template` (prompt-based) or `Copy Input Guide` (blank from scratch).',
    '',
    '2) Input location',
    '- Paste template into AI chat (Codex / ChatGPT / Claude).',
    '- Fill placeholders there. Do not fill inside prompt web app.',
    '',
    '3) Implementation loop',
    '- Ask AI to implement directly in this project.',
    '- Review scene timing, VO/BGM mix, and transitions.',
    '- Render final video from this project.',
    '',
    '4) Suggested commands',
    '- npm run start',
    '- npm run build',
  ].join('\n');
};

const ensureWorkflowFiles = (projectDir) => {
  const workflowDir = path.join(projectDir, '.nora-remotion-workflow');
  ensureDir(workflowDir);

  const guidePath = path.join(workflowDir, 'WORKFLOW.md');
  const initializedPath = path.join(workflowDir, 'INIT.json');

  const guideWritten = writeIfMissing(guidePath, `${buildGuide(path.basename(projectDir))}\n`);
  const initPayload = {
    initializedAt: new Date().toISOString(),
    projectDir,
    version: '0.1.0',
    mode: 'default-remotion-project',
  };
  fs.writeFileSync(initializedPath, `${JSON.stringify(initPayload, null, 2)}\n`, 'utf8');

  console.log(`[workflow] Initialized: ${workflowDir}`);
  if (!guideWritten) {
    console.log('[workflow] Existing WORKFLOW.md kept (not overwritten).');
  }
};

if (!command || command === '--help' || command === '-h') {
  console.log(HELP.trim());
  process.exit(0);
}

if (command !== 'init') {
  console.error(`[workflow] Unknown command: ${command}`);
  console.log(HELP.trim());
  process.exit(1);
}

const projectName = getArgValue('--project-name');
const cwd = process.cwd();
const projectDir = createProjectIfNeeded(cwd, projectName);
ensureStarterFiles(projectDir);
const rootUpdated = ensureStarterInRoot(projectDir);
const zodAdded = upsertPackageJsonDependency(projectDir, 'zod', '^3.25.76');
ensureWorkflowFiles(projectDir);
if (rootUpdated) {
  console.log('[workflow] Added NoraWorkflow starter composition to src/Root.tsx');
}
if (zodAdded) {
  console.log('[workflow] Added dependency: zod');
}
console.log(`[workflow] Done. Use project: ${projectDir}`);
