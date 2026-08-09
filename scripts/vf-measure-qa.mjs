/**
 * Visual-first: measure visible words + capture QA screenshots for all routes.
 * Requires a local server (dev or preview) at BASE.
 *
 * Usage: BASE=http://127.0.0.1:4321 node scripts/vf-measure-qa.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const ROOT = path.resolve('docs/design/visual-first');
const QA = path.join(ROOT, 'qa');
const FINAL = path.join(ROOT, 'final-gate');
const INTERACTIONS = path.join(FINAL, 'interactions');

const BEFORE = {
  '/': 381,
  '/dotfiles': 1093,
  '/agentic-workstation': 2274,
  '/agent-toolkit': 1662,
  '/v': 2207,
  '/create-awesome': 2169,
  '/community': 1515,
  '/blog': 51,
  '/projects': 366,
  '/open-source': 226,
  '/404.html': 28,
};

const ROUTES = Object.keys(BEFORE);

fs.mkdirSync(QA, { recursive: true });
fs.mkdirSync(INTERACTIONS, { recursive: true });

async function measure(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('header, [role="banner"]');
    const footer = document.querySelector('footer, [role="contentinfo"]');
    const isHidden = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return true;
      if (el.closest('[hidden], [aria-hidden="true"]')) return true;
      const det = el.closest('details');
      if (det && !det.open) {
        const summary = det.querySelector('summary');
        if (!summary || !summary.contains(el)) return true;
      }
      return false;
    };
    const inChrome = (el) => (nav && nav.contains(el)) || (footer && footer.contains(el));
    let visibleText = '';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || isHidden(parent) || inChrome(parent)) continue;
      const t = node.textContent.replace(/\s+/g, ' ').trim();
      if (t) visibleText += `${t} `;
    }
    const words = (visibleText.match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) || []).length;
    return { words };
  });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
await page.emulateMedia({ reducedMotion: 'reduce' });

const results = {};

for (const route of ROUTES) {
  const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-').replace('.html', '');
  const dir = path.join(QA, slug);
  fs.mkdirSync(dir, { recursive: true });

  let pathUrl = route;
  if (route === '/404.html') pathUrl = '/404.html';
  else if (route !== '/' && !route.endsWith('/')) pathUrl = `${route}/`;
  const url = `${BASE}${pathUrl}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      break;
    } catch (err) {
      if (attempt === 2) throw err;
      await page.waitForTimeout(800);
    }
  }
  await page.waitForTimeout(400);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(200);
  const metrics = await measure(page);
  await page.screenshot({ path: path.join(dir, '1440.png'), fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(dir, '390.png'), fullPage: false });

  const before = BEFORE[route];
  const after = metrics.words;
  const delta = before ? (((after - before) / before) * 100).toFixed(1) : 'n/a';
  results[route] = { before, after, deltaPct: Number(delta) };
  console.log(`${route}: ${before} → ${after} (${delta}%)`);
}

// Interaction evidence (best-effort)
await page.setViewportSize({ width: 1440, height: 1000 });

const shots = [
  {
    name: 'workstation-boot.png',
    go: '/agentic-workstation',
    act: async () => {
      await page.locator('[data-ws-map]').waitFor({ timeout: 8000 });
      await page
        .locator('[data-stage-index="2"]')
        .click({ force: true })
        .catch(() => {});
      await page.waitForTimeout(250);
      await page.locator('[data-ws-map]').screenshot({ path: path.join(INTERACTIONS, 'workstation-boot.png') });
    },
  },
  {
    name: 'dotfiles-smart-colors.png',
    go: '/dotfiles',
    act: async () => {
      const el = page.locator('[data-pipeline], .df-colors, .atk-colors').first();
      await el.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(INTERACTIONS, 'dotfiles-smart-colors.png'), fullPage: false });
    },
  },
  {
    name: 'v-lab-station.png',
    go: '/v',
    act: async () => {
      await page
        .locator('[data-v-lab], .v-lab')
        .first()
        .waitFor({ timeout: 8000 })
        .catch(() => {});
      await page
        .locator('label[for*="vsl"], [data-station="vsl"]')
        .first()
        .click({ force: true })
        .catch(() => {});
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(INTERACTIONS, 'v-lab-station.png'), fullPage: false });
    },
  },
  {
    name: 'create-awesome-composer.png',
    go: '/create-awesome',
    act: async () => {
      await page
        .locator('form, [data-composer]')
        .first()
        .waitFor({ timeout: 8000 })
        .catch(() => {});
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(INTERACTIONS, 'create-awesome-composer.png'), fullPage: false });
    },
  },
  {
    name: 'community-plaza.png',
    go: '/community',
    act: async () => {
      await page
        .locator('[data-community-plaza], .community-plaza')
        .first()
        .waitFor({ timeout: 8000 })
        .catch(() => {});
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(INTERACTIONS, 'community-plaza.png'), fullPage: false });
    },
  },
];

for (const shot of shots) {
  try {
    const go = shot.go.endsWith('/') || shot.go === '/' ? shot.go : `${shot.go}/`;
    await page.goto(`${BASE}${go}`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await shot.act();
    console.log(`interaction: ${shot.name}`);
  } catch (err) {
    console.warn(`interaction skipped ${shot.name}:`, err.message);
  }
}

fs.writeFileSync(path.join(ROOT, 'qa/_metrics.json'), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(FINAL, '_metrics.json'), JSON.stringify(results, null, 2));

await browser.close();
console.log('Wrote', path.join(ROOT, 'qa/_metrics.json'));
