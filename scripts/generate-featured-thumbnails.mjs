import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = path.join(root, 'public', 'assets', 'nest');
const assets = readdirSync(assetRoot)
  .filter((file) => /^island-.+-sm\.webp$/.test(file))
  .map((file) => file.replace(/-sm\.webp$/, ''))
  .sort();
const magick = process.env.MAGICK ?? 'magick';

for (const asset of assets) {
  const source = path.join(assetRoot, `${asset}-sm.webp`);
  const output = path.join(assetRoot, `${asset}-192.webp`);
  const result = spawnSync(
    magick,
    [source, '-resize', '192x192', '-strip', '-define', 'webp:method=6', '-quality', '82', output],
    { encoding: 'utf8' },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || `ImageMagick could not create ${output}`);
  }
}

console.log(`Generated ${assets.length} 192px island thumbnails.`);
