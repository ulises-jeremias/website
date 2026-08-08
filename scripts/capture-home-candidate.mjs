import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = join(root, 'docs/design/final-production/reference-comparison');
mkdirSync(out, { recursive: true });

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = createServer((req, res) => {
  let path = decodeURIComponent((req.url || '/').split('?')[0]);
  if (path.endsWith('/')) path += 'index.html';
  if (!extname(path)) path += '/index.html';
  const file = join(dist, path);
  if (!file.startsWith(dist) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
for (const [name, width, height] of [
  ['home-desktop', 1440, 1100],
  ['home-mobile', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: false });
  console.log(`wrote ${name}.png`);
  await page.close();
}

// Simple side-by-side contact sheet using canvas via page
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const ref = readFileSync(join(out, 'reference.png')).toString('base64');
const desk = readFileSync(join(out, 'home-desktop.png')).toString('base64');
await page.setContent(`<!doctype html><html><body style="margin:0;background:#0b0614;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;font-family:monospace;color:#fff">
<figure style="margin:0"><figcaption style="padding:8px;letter-spacing:.2em">REFERENCE</figcaption><img src="data:image/png;base64,${ref}" style="width:100%;height:auto;display:block"/></figure>
<figure style="margin:0"><figcaption style="padding:8px;letter-spacing:.2em">CANDIDATE 1440</figcaption><img src="data:image/png;base64,${desk}" style="width:100%;height:auto;display:block"/></figure>
</body></html>`);
await page.waitForTimeout(300);
await page.screenshot({ path: join(out, 'reference-vs-desktop.png'), fullPage: true });
console.log('wrote reference-vs-desktop.png');
await page.close();

await browser.close();
server.close();
console.log('DONE');
