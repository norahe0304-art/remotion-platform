#!/usr/bin/env node
/**
 * [INPUT]: process args, filesystem state, and optional create-video scaffolding.
 * [OUTPUT]: initialized workflow guide files in an existing or newly created project.
 * [POS]: CLI entrypoint for @nora/remotion-workflow package.
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
    '- Open prompt browser: https://github.com/norahe0304-art/remotion-platform (see prompts app docs)',
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
ensureWorkflowFiles(projectDir);
console.log(`[workflow] Done. Use project: ${projectDir}`);
