// @vitest-environment node
/**
 * Sponsor metrics refresh script — validation must match the build schema
 * (src/data/sponsorship.ts) so the script can never write a snapshot the
 * build rejects (ADR-004).
 */
import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { externalLogins, validateSnapshot } from './refresh-sponsor-metrics.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const snapshotPath = resolve(ROOT, 'src', 'data', 'generated', 'sponsor-metrics.json');

const validMetric = {
  id: 'npm-example-12m',
  project: 'Example',
  label: 'npm downloads, trailing 12 months',
  value: 10,
  unit: 'package downloads',
  period: { start: '2025-09-29', end: '2026-09-28' },
  retrievedAt: '2026-09-30',
  source: { name: 'npm downloads API', url: 'https://api.npmjs.org/downloads/range/last-year/example' },
  caveat: 'Counts every download, including CI. Downloads are not users.',
};
const snapshot = (metrics) => ({ generatedAt: '2026-09-30T00:00:00.000Z', generator: 'test', metrics });

describe('refresh-sponsor-metrics validateSnapshot', () => {
  it('accepts the committed snapshot', async () => {
    const committed = JSON.parse(await readFile(snapshotPath, 'utf8'));
    expect(validateSnapshot(committed)).toEqual([]);
  });

  it('accepts a well-formed metric', () => {
    expect(validateSnapshot(snapshot([validMetric]))).toEqual([]);
  });

  it.each([
    ['a unit that implies people', { unit: 'monthly users' }],
    ['a label that implies installs', { label: 'installs this month' }],
    ['a short caveat', { caveat: 'Too short.' }],
    ['a non-https source', { source: { name: 'x', url: 'http://example.com' } }],
    ['an inverted period', { period: { start: '2026-09-28', end: '2025-09-29' } }],
    ['a missing retrievedAt', { retrievedAt: undefined }],
    ['a negative value', { value: -1 }],
  ])('rejects %s', (_label, override) => {
    expect(validateSnapshot(snapshot([{ ...validMetric, ...override }])).length).toBeGreaterThan(0);
  });

  it('rejects duplicate metric ids and a missing generator', () => {
    expect(validateSnapshot(snapshot([validMetric, validMetric]))).toContain('npm-example-12m: duplicate id');
    expect(validateSnapshot({ ...snapshot([validMetric]), generator: '' })).toContain('generator is required');
  });
});

describe('refresh-sponsor-metrics externalLogins', () => {
  it('dedupes logins and excludes the owner, bots, and non-users', () => {
    const batch = [
      { login: 'ulises-jeremias', type: 'User' },
      { login: 'contributor', type: 'User' },
      { login: 'contributor', type: 'User' },
      { login: 'dependabot[bot]', type: 'User' },
      { login: 'some-org', type: 'Organization' },
      { login: 'github-actions[bot]', type: 'Bot' },
    ];
    expect([...externalLogins(batch)]).toEqual(['contributor']);
  });
});
