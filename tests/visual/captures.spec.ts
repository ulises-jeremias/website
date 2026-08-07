import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join('docs', 'design', 'final', '2026-08-07', 'waves');

const captures: Array<{ path: string; name: string; width: number; height: number }> = [
  { path: '/', name: 'home', width: 1440, height: 1100 },
  { path: '/', name: 'home', width: 390, height: 844 },
  { path: '/agent-toolkit', name: 'agent-toolkit', width: 1440, height: 1100 },
  { path: '/agent-toolkit', name: 'agent-toolkit', width: 390, height: 844 },
  { path: '/dotfiles', name: 'dotfiles', width: 1440, height: 1100 },
  { path: '/dotfiles', name: 'dotfiles', width: 390, height: 844 },
  { path: '/agentic-workstation', name: 'workstation', width: 1440, height: 1100 },
  { path: '/v', name: 'v', width: 1440, height: 1100 },
  { path: '/create-awesome', name: 'create-awesome', width: 1440, height: 1100 },
  { path: '/community', name: 'community', width: 1440, height: 1100 },
  { path: '/blog', name: 'blog', width: 1440, height: 1100 },
  { path: '/projects', name: 'projects', width: 1440, height: 1100 },
  { path: '/open-source', name: 'open-source', width: 1440, height: 1100 },
];

test('capture final review screenshots', async ({ page }) => {
  await mkdir(outDir, { recursive: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const shot of captures) {
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(shot.path, { waitUntil: 'domcontentloaded' });
    const file = path.join(outDir, `${shot.name}-${shot.width}.png`);
    await page.screenshot({ path: file, fullPage: false });
  }
});
