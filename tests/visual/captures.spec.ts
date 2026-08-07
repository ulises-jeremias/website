import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join('docs', 'design', 'final', '2026-08-07-zip');

const captures: Array<{ path: string; name: string; width: number; height: number; fullPage?: boolean }> = [
  { path: '/', name: 'home/desktop', width: 1440, height: 1100 },
  { path: '/', name: 'home/desktop-full', width: 1440, height: 1100, fullPage: true },
  { path: '/', name: 'home/mobile', width: 390, height: 844 },
  { path: '/', name: 'home/mobile-full', width: 390, height: 844, fullPage: true },
  { path: '/agent-toolkit', name: 'routes/agent-toolkit', width: 1440, height: 1100 },
  { path: '/agent-toolkit', name: 'routes/agent-toolkit', width: 390, height: 844 },
  { path: '/dotfiles', name: 'routes/dotfiles', width: 1440, height: 1100 },
  { path: '/dotfiles', name: 'routes/dotfiles', width: 390, height: 844 },
  { path: '/agentic-workstation', name: 'routes/workstation', width: 1440, height: 1100 },
  { path: '/agentic-workstation', name: 'routes/workstation', width: 390, height: 844 },
  { path: '/v', name: 'routes/v', width: 1440, height: 1100 },
  { path: '/v', name: 'routes/v', width: 390, height: 844 },
  { path: '/create-awesome', name: 'routes/create-awesome', width: 1440, height: 1100 },
  { path: '/create-awesome', name: 'routes/create-awesome', width: 390, height: 844 },
  { path: '/community', name: 'routes/community', width: 1440, height: 1100 },
  { path: '/community', name: 'routes/community', width: 390, height: 844 },
  { path: '/blog', name: 'routes/blog', width: 1440, height: 1100 },
  { path: '/blog', name: 'routes/blog', width: 390, height: 844 },
  { path: '/projects', name: 'routes/projects', width: 1440, height: 1100 },
  { path: '/projects', name: 'routes/projects', width: 390, height: 844 },
  { path: '/open-source', name: 'routes/open-source', width: 1440, height: 1100 },
  { path: '/open-source', name: 'routes/open-source', width: 390, height: 844 },
  { path: '/missing-page-for-404', name: 'routes/404', width: 1440, height: 1100 },
  { path: '/missing-page-for-404', name: 'routes/404', width: 390, height: 844 },
];

test('capture ZIP-fidelity final screenshots', async ({ page }) => {
  await mkdir(path.join(outDir, 'home'), { recursive: true });
  await mkdir(path.join(outDir, 'routes'), { recursive: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const shot of captures) {
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(shot.path, { waitUntil: 'networkidle' });
    const file = path.join(outDir, `${shot.name}-${shot.width}.png`);
    await mkdir(path.dirname(file), { recursive: true });
    await page.screenshot({ path: file, fullPage: Boolean(shot.fullPage) });
  }
});
