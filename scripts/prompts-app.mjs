import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../prompts', import.meta.url));
const port = Number(process.env.PORT || 4180);
const host = process.env.HOST || '127.0.0.1';
const shouldOpen = process.argv.includes('--open');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

const toAppPath = (urlPath) => {
  if (urlPath === '/' || urlPath === '/app' || urlPath === '/app/') return '/app/index.html';
  if (urlPath.endsWith('/')) return `${urlPath}index.html`;
  return urlPath;
};

const openBrowser = (url) => {
  const platform = process.platform;
  if (platform === 'darwin') {
    execFile('open', [url], () => {});
    return;
  }
  if (platform === 'win32') {
    execFile('cmd', ['/c', 'start', '', url], () => {});
    return;
  }
  execFile('xdg-open', [url], () => {});
};

const server = http.createServer(async (req, res) => {
  const urlPath = toAppPath(req.url || '/');
  const safePath = normalize(urlPath).replace(/^\/+/, '');
  const full = join(root, safePath);

  if (!full.startsWith(root)) {
    res.writeHead(403).end('forbidden');
    return;
  }

  try {
    const data = await readFile(full);
    res.setHeader('content-type', mime[extname(full)] || 'application/octet-stream');
    res.writeHead(200).end(data);
  } catch {
    res.writeHead(404).end('not found');
  }
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/app/`;
  console.log(`Open in browser: ${url}`);
  console.log('In the app: Choose source -> Filter by tags/keywords -> Preview -> Copy AI Template');
  console.log(`If ${port} is busy: PORT=${port + 1} npm run prompts:app`);
  if (shouldOpen) openBrowser(url);
});
