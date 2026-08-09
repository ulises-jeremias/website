import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4321';
const GATE = path.resolve('docs/design/visual-first/toolkit-gate');
const INT = path.join(GATE, 'interactions');
fs.mkdirSync(INT, { recursive: true });

async function measure(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('header, [role="banner"]');
    const footer = document.querySelector('footer, [role="contentinfo"]');
    const isHidden = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return true;
      if (el.closest('[hidden], [aria-hidden="true"]')) return true;
      const det = el.closest('details');
      if (det && !det.open && !det.querySelector('summary')?.contains(el)) return true;
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
      if (t) visibleText += t + ' ';
    }
    const words = (visibleText.match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) || []).length;
    return { words, sample: visibleText.slice(0, 800) };
  });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(`${BASE}/agent-toolkit`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

await page.setViewportSize({ width: 1440, height: 1000 });
await page.waitForTimeout(300);
const metrics = await measure(page);
await page.screenshot({ path: path.join(GATE, 'new-1440.png'), fullPage: false });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(GATE, 'new-390.png'), fullPage: false });

// Interactions at desktop
await page.setViewportSize({ width: 1440, height: 1000 });
await page.waitForTimeout(200);

// capability select — agents
await page.locator('label[for="atk-family-agents"]').click({ force: true });
await page.waitForTimeout(250);
await page.locator('.atk-nexus').screenshot({ path: path.join(INT, 'capability-select.png') });

// queue vs swarm
await page.locator('.atk-qvs').scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.locator('.atk-qvs').screenshot({ path: path.join(INT, 'queue-vs-swarm.png') });

// pair / team / full
for (const recipe of ['pair', 'team', 'full']) {
  await page.locator('.atk-swarm').scrollIntoViewIfNeeded();
  await page.locator(`label[for="atk-recipe-${recipe}"]`).click({ force: true });
  await page.waitForTimeout(350);
  await page.locator('.atk-swarm__room').screenshot({ path: path.join(INT, `${recipe}.png`) });
}

// herdr / tmux
await page.locator('label[for="atk-shell-herdr"]').click({ force: true });
await page.waitForTimeout(200);
await page.locator('.atk-swarm__room').screenshot({ path: path.join(INT, 'herdr.png') });
await page.locator('label[for="atk-shell-tmux"]').click({ force: true });
await page.waitForTimeout(200);
await page.locator('.atk-swarm__room').screenshot({ path: path.join(INT, 'tmux.png') });

// governance — scrub to governance stage
const govBtn = page.locator('[data-stage-index="7"], button:has-text("Governance")').first();
if (await govBtn.count()) {
  await govBtn.click({ force: true });
  await page.waitForTimeout(300);
  await page.locator('.atk-swarm__room').screenshot({ path: path.join(INT, 'governance.png') });
}

fs.writeFileSync(path.join(GATE, '_after-metrics.json'), JSON.stringify(metrics, null, 2));
console.log('AFTER_WORDS', metrics.words);
await browser.close();
