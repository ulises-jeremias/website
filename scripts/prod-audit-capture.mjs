import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://www.ulises-jeremias.dev';
const out = join(root, 'docs/design/final-production/audit');
const routes = [
  ['/', 'home'],
  ['/dotfiles', 'dotfiles'],
  ['/agentic-workstation', 'agentic-workstation'],
  ['/agent-toolkit', 'agent-toolkit'],
  ['/v', 'v'],
  ['/create-awesome', 'create-awesome'],
  ['/community', 'community'],
  ['/blog', 'blog'],
  ['/projects', 'projects'],
  ['/open-source', 'open-source'],
  ['/404.html', '404'],
];
const viewports = [
  { name: '1440', width: 1440, height: 1100 },
  { name: '390', width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const [path, dir] of routes) {
  mkdirSync(join(out, dir), { recursive: true });
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const res = await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(out, dir, `${vp.name}.png`), fullPage: false });
    console.log(`${path} ${vp.name} status=${res?.status()}`);
    await page.close();
  }
}
await browser.close();
console.log('DONE');
