#!/usr/bin/env node
/**
 * Generate responsive PNG fallbacks for the atlas island art.
 *
 * The site ships webp-first `<picture>` art with 220px/440px PNG fallbacks
 * (see src/features/home/components/ProjectWorld.astro). When a new world is
 * added, the webp pair lands in public/assets/nest/ but the PNG fallback is
 * easy to forget. This script can create missing fallbacks or resize existing
 * island fallbacks to their display sizes using the Playwright canvas.
 * The homepage hero uses a separately optimized JPEG fallback.
 *
 * Usage:
 *   node scripts/generate-island-pngs.mjs                 # create missing PNGs
 *   node scripts/generate-island-pngs.mjs --regenerate    # resize PNG fallbacks to display dimensions
 *   node scripts/generate-island-pngs.mjs --check         # verify PNG dimensions and hero JPEG
 */

import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { access, constants, readdir, readFile, writeFile } from 'node:fs/promises';
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
const regenerate = process.argv.includes('--regenerate');
const fallbackSizesFor = (webp) => (webp.startsWith('logo-nest.') ? [256] : [220, 440]);
const fallbackPathFor = (webp, size) => {
  const base = path.basename(webp, '.webp');
  return path.join(outDir, `${base}${webp.startsWith('logo-nest.') ? '' : `-${size}`}.png`);
};

const webpFiles = (await readdir(nestDir)).filter(
  (f) => f.endsWith('.webp') && !f.startsWith('hero-bg.') && !f.endsWith('-sm.webp') && !f.endsWith('-192.webp'),
);
const missing = [];
const invalidDimensions = [];
for (const webp of webpFiles) {
  for (const size of fallbackSizesFor(webp)) {
    const outPath = fallbackPathFor(webp, size);
    try {
      await access(outPath, constants.F_OK);
      const png = await readFile(outPath);
      const width = png.readUInt32BE(16);
      const height = png.readUInt32BE(20);
      const hasInvalidDimensions = width !== size || height !== size;
      if (regenerate) missing.push({ webp, outPath, size });
      if (checkOnly && hasInvalidDimensions) {
        invalidDimensions.push({ outPath, width, height, size });
      }
    } catch {
      missing.push({ webp, outPath, size });
    }
  }
}

if (checkOnly) {
  const heroFallback = path.join(outDir, 'hero-bg.jpg');
  let heroFallbackMissing = false;
  try {
    await access(heroFallback, constants.F_OK);
  } catch {
    heroFallbackMissing = true;
  }

  const fallbackCount = webpFiles.reduce((count, webp) => count + fallbackSizesFor(webp).length, 0);
  if (missing.length === 0 && invalidDimensions.length === 0 && !heroFallbackMissing) {
    console.log(`island-pngs: all ${fallbackCount} PNG variants and hero JPEG present`);
    process.exit(0);
  }
  console.error(
    `island-pngs: ${missing.length} missing or incorrectly sized island PNG fallback(s)${heroFallbackMissing ? ' and hero JPEG' : ''}:`,
  );
  for (const m of missing) console.error(`  - ${path.relative(root, m.outPath)}`);
  for (const image of invalidDimensions) {
    console.error(
      `  - ${path.relative(root, image.outPath)} (${image.width}x${image.height}; expected ${image.size}x${image.size})`,
    );
  }
  if (heroFallbackMissing) console.error(`  - ${path.relative(root, heroFallback)}`);
  process.exit(1);
}

if (missing.length === 0) {
  console.log(`island-pngs: all PNG variants present`);
  process.exit(0);
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

for (const { webp, outPath, size } of missing) {
  const b64 = await page.evaluate(
    async ({ src, size }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      return canvas.toDataURL('image/png');
    },
    { src: webp, size },
  );
  const bytes = Buffer.from(b64.replace(/^data:image\/png;base64,/, ''), 'base64');
  await writeFile(outPath, bytes);
  console.log(`island-pngs: wrote ${path.relative(root, outPath)} (${(bytes.length / 1024).toFixed(0)} KiB)`);
}

await page.evaluate(() => fetch('about:blank')).catch(() => {});
await writeFile(shimPath, '').catch(() => {});
const { unlink } = await import('node:fs/promises');
await unlink(shimPath).catch(() => {});
await browser.close();
