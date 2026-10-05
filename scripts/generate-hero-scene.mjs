#!/usr/bin/env node
/**
 * Compose the original air-traffic illustration into the responsive hero plates.
 * The single plate request keeps the page's existing route budget intact while
 * the source art remains editable under src/media-sources/nest.
 */

import { execFileSync } from 'node:child_process';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'src', 'media-sources', 'nest');
const outputDir = path.join(root, 'public', 'assets', 'nest');
const traffic = path.join(sourceDir, 'sky-traffic.png');

const compose = async ({ base, output, canvas, width, left, top, quality }) => {
  execFileSync(
    'magick',
    [
      path.join(sourceDir, base),
      '(',
      traffic,
      '-resize',
      `${width}x`,
      ')',
      '-gravity',
      'northwest',
      '-geometry',
      `+${left}+${top}`,
      '-composite',
      '-define',
      'webp:method=6',
      '-quality',
      String(quality),
      '-strip',
      path.join(outputDir, output),
    ],
    { stdio: 'inherit' },
  );

  const { size } = await stat(path.join(outputDir, output));
  console.log(`hero-scene: ${canvas} ${output} (${size.toLocaleString()} bytes)`);
};

await compose({
  base: 'hero-bg-base.webp',
  output: 'hero-bg.webp',
  canvas: '1024×1024 desktop',
  width: 800,
  left: 150,
  top: 130,
  quality: 80,
});

await compose({
  base: 'hero-bg-base-sm.webp',
  output: 'hero-bg-sm.webp',
  canvas: '960×960 mobile',
  width: 640,
  left: 50,
  top: 230,
  quality: 78,
});
