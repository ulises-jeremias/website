import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const assetsDirectory = path.resolve(process.cwd(), 'public/assets');
const fallbackFiles = readdirSync(assetsDirectory).filter((name) => /^island-.+-(?:220|440)\.png$/.test(name));

describe('responsive island PNG fallbacks', () => {
  it('provides 220px and 440px variants for every island', () => {
    expect(fallbackFiles).toHaveLength(26);

    const islandNames = new Set(fallbackFiles.map((name) => name.replace(/-(?:220|440)\.png$/, '')));
    expect(islandNames.size).toBe(13);
    expect(islandNames.has('island-atlas-dock')).toBe(true);

    for (const island of islandNames) {
      for (const size of [220, 440]) {
        const name = `${island}-${size}.png`;
        const png = readFileSync(path.join(assetsDirectory, name));

        expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        expect(png.readUInt32BE(16), name).toBe(size);
        expect(png.readUInt32BE(20), name).toBe(island === 'island-atlas-dock' ? size / 2 : size);
      }
    }
  });

  it('keeps the legacy fallback payload within the responsive image budget', () => {
    const totalBytes = (size: 220 | 440) =>
      fallbackFiles
        .filter((name) => name.endsWith(`-${size}.png`))
        .reduce((total, name) => total + statSync(path.join(assetsDirectory, name)).size, 0);

    expect(totalBytes(220)).toBeLessThan(1_000_000);
    expect(totalBytes(440)).toBeLessThan(2_800_000);
  });
});
