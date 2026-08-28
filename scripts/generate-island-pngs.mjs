#!/usr/bin/env node
/**
 * Generate PNG fallbacks for the atlas island art (public/assets/*.png).
 *
 * The site ships webp-first `<picture>` art with a single-size PNG fallback
 * (see src/features/home/components/ProjectWorld.astro). When a new world is
 * added, the webp pair lands in public/assets/nest/ but the PNG fallback is
 * easy to forget — this script regenerates every missing PNG from the full
 * (512w) webp using the Playwright Chromium canvas, so the pipeline needs no
 * native image tools.
 *
 * Usage:
 *   node scripts/generate-island-pngs.mjs          # create missing PNGs
 *   node scripts/generate-island-pngs.mjs --check  # exit 1 if any missing
 */

import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { access, constants, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
let executablePath;
try {
  executablePath = execFileSync('node', [path.join(here, 'find-chromium.mjs')], { encoding: 'utf8' }).trim();
} catch {
  executablePath = undefined;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nestDir = path.join(root, 'public', 'assets', 'nest');
const outDir = path.join(root, 'public', 'assets');

const checkOnly = process.argv.includes('--check');

const webpFiles = (await readdir(nestDir)).filter((f) => f.endsWith('.webp') && !f.endsWith('-sm.webp'));
const missing = [];
for (const webp of webpFiles) {
  const pngName = `${path.basename(webp, '.webp')}.png`;
  const outPath = path.join(outDir, pngName);
  try {
    await access(outPath, constants.F_OK);
  } catch {
    missing.push({ webp, outPath });
  }
}

if (missing.length === 0) {
  console.log(`island-pngs: all ${webpFiles.length} fallbacks present`);
  process.exit(0);
}

if (checkOnly) {
  console.error(`island-pngs: missing ${missing.length} PNG fallback(s):`);
  for (const m of missing) console.error(`  - ${path.relative(root, m.outPath)}`);
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'],
});
const page = await browser.newPage();

await page.goto('about:blank');
// Load a file:// page next to the webp sources so relative <img> decode works.
const shimPath = path.join(nestDir, '__island-pngs__.html');
await writeFile(shimPath, '<!doctype html><title>island-pngs</title>');
await page.goto(`file://${shimPath}`, { waitUntil: 'load' });

for (const { webp, outPath } of missing) {
  const b64 = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
  }, webp);
  const bytes = Buffer.from(b64.replace(/^data:image\/png;base64,/, ''), 'base64');
  await writeFile(outPath, bytes);
  console.log(`island-pngs: wrote ${path.relative(root, outPath)} (${(bytes.length / 1024).toFixed(0)} KiB)`);
}

await page.evaluate(() => fetch('about:blank')).catch(() => {});
await writeFile(shimPath, '').catch(() => {});
const { unlink } = await import('node:fs/promises');
await unlink(shimPath).catch(() => {});
await browser.close();
