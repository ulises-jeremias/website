#!/usr/bin/env node
/**
 * Optimize shipped media: resize to a max width and re-encode to webp
 * (quality 82) using the Playwright Chromium canvas — no native image deps.
 *
 * Usage: node scripts/optimize-media.mjs [maxWidth=1280] [quality=82]
 * Processes every *.png under public/media (recursively) that is larger
 * than its future webp savings threshold (>160 KiB), writing *.webp beside
 * it and printing the result. Idempotent: skips already-optimized pairs.
 */

import { readdir, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const mediaDir = path.join(root, 'public', 'media');
const maxWidth = Number(process.argv[2] ?? 1280);
const quality = Number(process.argv[3] ?? 82);

let executablePath;
try {
  executablePath = execFileSync('node', [path.join(here, 'find-chromium.mjs')], { encoding: 'utf8' }).trim();
} catch {
  executablePath = undefined;
}

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.png')) out.push(full);
  }
  return out;
};

const files = await walk(mediaDir);
const heavy = [];
for (const file of files) {
  const webp = `${file.slice(0, -4)}.webp`;
  try {
    await stat(webp, constants.F_OK);
    continue; // already optimized
  } catch {}
  const info = await stat(file);
  if (info.size > 160 * 1024) heavy.push({ file, webp, size: info.size });
}

if (heavy.length === 0) {
  console.log('optimize-media: nothing to do');
  process.exit(0);
}

const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'],
});
const page = await browser.newPage();
const shimPath = path.join(mediaDir, '__optimize__.html');
await writeFile(shimPath, '<!doctype html><title>optimize</title>');
await page.goto(`file://${shimPath}`, { waitUntil: 'load' });

for (const { file, webp, size } of heavy) {
  const rel = path.relative(mediaDir, file).split(path.sep).join('/');
  const b64 = await page.evaluate(
    async ({ src, maxWidth, quality }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', quality);
    },
    { src: rel, maxWidth, quality },
  );
  const bytes = Buffer.from(b64.replace(/^data:image\/webp;base64,/, ''), 'base64');
  await writeFile(webp, bytes);
  console.log(
    `optimize-media: ${path.relative(root, file)} (${(size / 1024).toFixed(0)} KiB) -> ${path.relative(root, webp)} (${(bytes.length / 1024).toFixed(0)} KiB)`,
  );
}

await page.evaluate(() => undefined).catch(() => {});
const { unlink } = await import('node:fs/promises');
await unlink(shimPath).catch(() => {});
await browser.close();
