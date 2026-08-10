import type { FullConfig } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));

function digest(value: Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}

export default async function verifyVisualServer(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: projectRoot,
    encoding: 'utf8',
  }).trim();

  if (typeof baseURL !== 'string') {
    throw new Error('The visual harness requires a string Playwright baseURL.');
  }

  const expectedIndex = await readFile(join(projectRoot, 'dist', 'index.html'));
  const response = await fetch(new URL('/', baseURL));

  if (!response.ok) {
    throw new Error(`The visual harness server returned HTTP ${response.status} for ${baseURL}.`);
  }

  const servedIndex = new Uint8Array(await response.arrayBuffer());
  const expectedDigest = digest(expectedIndex);
  const servedDigest = digest(servedIndex);

  if (servedDigest !== expectedDigest) {
    throw new Error(
      [
        "The visual harness is not serving this worktree's freshly built dist/index.html.",
        `Expected SHA-256: ${expectedDigest}`,
        `Served SHA-256:   ${servedDigest}`,
        'Stop the conflicting server or choose an unused VISUAL_TEST_PORT.',
      ].join('\n'),
    );
  }

  const html = new TextDecoder().decode(servedIndex);

  if (html.includes('/@vite/client') || html.includes('astro-dev-toolbar')) {
    throw new Error('The visual harness detected Astro/Vite development tooling in served HTML.');
  }

  process.stdout.write(
    `[visual-harness] verified revision ${revision} from ${projectRoot} at ${baseURL} (${servedDigest.slice(0, 12)})\n`,
  );
}
