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
const sourceCrops = {
  'island-agent': '1197x1132+31+72',
  'island-atlas-dock': '1400x700+68+260',
};
const sources = readdirSync(sourceRoot)
  .filter((file) => /^island-.+\.png$/.test(file))
  .sort();

for (const source of sources) {
  const base = path.basename(source, '.png');
  const input = path.join(sourceRoot, source);
  const isDock = base === 'island-atlas-dock';
  const extent = isDock ? '1400x700' : '1800x1800';
  const variants = isDock
    ? [
        ['', 640, 320, 86],
        ['-sm', 440, 220, 84],
      ]
    : [
        ['', 640, 640, 86],
        ['-sm', 440, 440, 84],
      ];

  for (const [suffix, width, height, quality] of variants) {
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
        extent,
        '-resize',
        `${width}x${height}`,
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

  for (const [width, height] of [220, 440].map((size) => [size, isDock ? size / 2 : size])) {
    const fallback = path.join(fallbackRoot, `${base}-${width}.png`);
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
        extent,
        '-resize',
        `${width}x${height}`,
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
}

console.log(`Generated ${sources.length} responsive atlas island source(s).`);
