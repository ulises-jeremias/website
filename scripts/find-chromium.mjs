#!/usr/bin/env node
/** Resolve a Chromium binary for Playwright tooling without downloading twice. */

import { existsSync, readdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
if (existsSync(cache)) {
  for (const entry of readdirSync(cache)) {
    if (!entry.startsWith('chromium-') || entry.includes('headless')) continue;
    for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
      const candidate = path.join(cache, entry, rel);
      if (existsSync(candidate)) {
        console.log(candidate);
        process.exit(0);
      }
    }
  }
}
process.exit(1);
