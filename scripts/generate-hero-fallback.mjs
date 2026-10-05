#!/usr/bin/env node
/**
 * Create the broad-compatibility JPEG fallback from the first-party hero WebP.
 * Keep the responsive WebP pair as the preferred source in the homepage.
 */

import { execFileSync } from 'node:child_process';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public', 'assets', 'nest', 'hero-bg.webp');
const output = path.join(root, 'public', 'assets', 'hero-bg.jpg');

execFileSync('magick', [source, '-sampling-factor', '4:4:4', '-quality', '94', '-strip', output], {
  stdio: 'inherit',
});

const { size } = await stat(output);
console.log(`hero-fallback: wrote public/assets/hero-bg.jpg (${size.toLocaleString()} bytes)`);
