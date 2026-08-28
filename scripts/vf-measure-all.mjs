import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { measureVisibleContent } from './lib/vf-visible-content.mjs';

const BASE = process.env.VF_BASE || 'http://127.0.0.1:4321';
const ROOT = path.resolve('docs/design/visual-first');
const QA = path.join(ROOT, 'qa');
const INT = path.join(QA, 'interactions');
const BEFORE = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/_metrics.json'), 'utf8'));

const ROUTES = [
  '/',
  '/dotfiles',
  '/agentic-workstation',
  '/agent-toolkit',
  '/v',
  '/create-awesome',
  '/community',
  '/blog',
  '/projects',
  '/open-source',
  '/404.html',
];

fs.mkdirSync(INT, { recursive: true });

function routeKey(route) {
  if (route === '/') return 'home';
  if (route === '/404.html') return '404';
  return route.replace(/^\//, '').replace(/\//g, '-');
}

function beforeWords(route) {
  const key = routeKey(route);
  const row = BEFORE[key] || BEFORE[route] || BEFORE.routes?.[key];
  if (typeof row === 'number') return row;
  if (row && typeof row.words === 'number') return row.words;
  return null;
}

async function captureInteractions(page) {
  const shots = [
    {
      name: 'toolkit-capability-select.png',
      path: '/agent-toolkit',
      run: async () => {
        await page
          .locator('label[for="atk-family-agents"]')
          .click({ force: true })
          .catch(() => {});
        await page
          .locator('.atk-nexus')
          .screenshot({ path: path.join(INT, 'toolkit-capability-select.png') })
          .catch(() => {});
      },
    },
    {
      name: 'workstation-profile.png',
      path: '/agentic-workstation',
      run: async () => {
        await page
          .locator('label[for="ws-profile-technical"]')
          .click({ force: true })
          .catch(() => {});
        await page
          .locator('[data-ws-map], .ws-map')
          .first()
          .screenshot({ path: path.join(INT, 'workstation-profile.png') })
          .catch(() => {});
      },
    },
    {
      name: 'dotfiles-smart-colors.png',
      path: '/dotfiles',
      run: async () => {
        await page
          .locator('.smart-colors, .df-colors, [data-smart-colors], [data-df-colors]')
          .first()
          .screenshot({ path: path.join(INT, 'dotfiles-smart-colors.png') })
          .catch(() => {});
      },
    },
    {
      name: 'v-station-vtl.png',
      path: '/v',
      run: async () => {
        await page
          .locator('[data-v-station="vtl"]')
          .click({ force: true })
          .catch(() => {});
        await page
          .locator('[data-v-lab], .v-lab')
          .first()
          .screenshot({ path: path.join(INT, 'v-station-vtl.png') })
          .catch(() => {});
      },
    },
    {
      name: 'create-awesome-node.png',
      path: '/create-awesome',
      run: async () => {
        await page
          .locator('label[for="ca-runtime-node"], [data-family="node"]')
          .first()
          .click({ force: true })
          .catch(() => {});
        await page
          .locator('.ca-world, .ca-composer')
          .first()
          .screenshot({ path: path.join(INT, 'create-awesome-node.png') })
          .catch(() => {});
      },
    },
    {
      name: 'community-filter.png',
      path: '/community',
      run: async () => {
        await page
          .locator('.cm-explore__chip, [data-cm-node]')
          .first()
          .click({ force: true })
          .catch(() => {});
        await page
          .locator('[data-cm-plaza], .cm-plaza')
          .first()
          .screenshot({ path: path.join(INT, 'community-filter.png') })
          .catch(() => {});
      },
    },
    {
      name: 'open-source-node.png',
      path: '/open-source',
      run: async () => {
        await page
          .locator('.constellation')
          .first()
          .screenshot({ path: path.join(INT, 'open-source-node.png') })
          .catch(() => {});
      },
    },
  ];

  for (const shot of shots) {
    await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await shot.run();
  }
}

let preview = null;
if (process.env.VF_SKIP_PREVIEW !== '1') {
  preview = spawn('pnpm', ['preview', '--host', '127.0.0.1', '--port', '4321'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('preview timeout')), 20000);
    preview.stdout.on('data', (buf) => {
      if (String(buf).includes('4321') || String(buf).toLowerCase().includes('local')) {
        clearTimeout(t);
        resolve();
      }
    });
    preview.stderr.on('data', () => {});
  });
  await new Promise((r) => setTimeout(r, 800));
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
await page.emulateMedia({ reducedMotion: 'reduce' });

const after = {};
for (const route of ROUTES) {
  const key = routeKey(route);
  const dir = path.join(QA, key);
  fs.mkdirSync(dir, { recursive: true });
  const urlPath = route === '/' ? '/' : route === '/404.html' ? '/404.html' : route.endsWith('/') ? route : `${route}/`;
  await page.goto(`${BASE}${urlPath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(200);
  const metrics = await measureVisibleContent(page);
  await page.screenshot({ path: path.join(dir, '1440.png'), fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(dir, '390.png'), fullPage: false });
  const before = beforeWords(route);
  const delta = before == null ? null : (((metrics.words - before) / before) * 100).toFixed(1);
  after[route] = { before, after: metrics.words, paragraphs: metrics.paragraphs, deltaPct: delta };
  console.log(route, before, '→', metrics.words, delta == null ? '' : `${delta}%`);
}

await page.setViewportSize({ width: 1440, height: 1000 });
await captureInteractions(page);

fs.writeFileSync(path.join(ROOT, 'qa/_after-metrics.json'), JSON.stringify(after, null, 2));
fs.writeFileSync(path.join(ROOT, '_after-metrics.json'), JSON.stringify(after, null, 2));

await browser.close();
if (preview) preview.kill('SIGTERM');
console.log('DONE', path.join(ROOT, 'qa/_after-metrics.json'));
