import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../prompts', import.meta.url));
const port = Number(process.env.PORT || 4180);
const host = process.env.HOST || '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const urlPath = req.url === '/' ? '/app/index.html' : req.url;
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
  console.log(`Prompts app: http://${host}:${port}/app/`);
});
