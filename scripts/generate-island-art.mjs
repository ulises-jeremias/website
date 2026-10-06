#!/usr/bin/env node
/**
 * Generate responsive production variants for authored atlas island PNG sources.
 *
 * Sources live in src/features/home/assets/ and are not copied to the public
 * output. Run assets:featured afterwards for 192px thumbnails.
 */

import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'src', 'features', 'home', 'assets');
const outputRoot = path.join(root, 'public', 'assets', 'nest');
const fallbackRoot = path.join(root, 'public', 'assets');
const magick = process.env.MAGICK ?? 'magick';
// The generated source has scattered low-opacity pixels outside this measured
// opaque island silhouette. Crop those away before adding consistent padding.
const sourceCrops = { 'island-agent': '1197x1132+31+72' };
const sources = readdirSync(sourceRoot)
  .filter((file) => /^island-.+\.png$/.test(file))
  .sort();

for (const source of sources) {
  const base = path.basename(source, '.png');
  const input = path.join(sourceRoot, source);
  for (const [suffix, size, quality] of [
    ['', 640, 86],
    ['-sm', 440, 84],
  ]) {
    const output = path.join(outputRoot, `${base}${suffix}.webp`);
    const result = spawnSync(
      magick,
      [
        input,
        ...(sourceCrops[base] ? ['-crop', sourceCrops[base], '+repage'] : []),
        '-gravity',
        'center',
        '-background',
        'none',
        '-extent',
        '1800x1800',
        '-resize',
        `${size}x${size}`,
        '-strip',
        '-define',
        'webp:method=6',
        '-define',
        'webp:alpha-quality=100',
        '-quality',
        String(quality),
        output,
      ],
      { encoding: 'utf8' },
    );

    if (result.status !== 0) {
      throw new Error(result.stderr || `ImageMagick could not create ${output}`);
    }
    console.log(`island-art: wrote ${path.relative(root, output)}`);
  }

  const fallback = path.join(fallbackRoot, `${base}.png`);
  const result = spawnSync(
    magick,
    [
      input,
      ...(sourceCrops[base] ? ['-crop', sourceCrops[base], '+repage'] : []),
      '-gravity',
      'center',
      '-background',
      'none',
      '-extent',
      '1800x1800',
      '-resize',
      '640x640',
      '-strip',
      '-define',
      'png:compression-level=9',
      fallback,
    ],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || `ImageMagick could not create ${fallback}`);
  }
  console.log(`island-art: wrote ${path.relative(root, fallback)}`);
}

console.log(`Generated ${sources.length} responsive atlas island source(s).`);
