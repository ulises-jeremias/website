import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERCEL_PATH = resolve(ROOT, 'vercel.json');

const REQUIRED_SECURITY_HEADERS = [
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
];

describe('vercel.json security headers', () => {
  /** @type {{ headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }> }} */
  let config;

  it('parses as valid JSON', async () => {
    const raw = await readFile(VERCEL_PATH, 'utf8');
    config = JSON.parse(raw);
    expect(config).toBeTruthy();
    expect(Array.isArray(config.headers)).toBe(true);
  });

  it('has a global rule covering all paths', async () => {
    const raw = await readFile(VERCEL_PATH, 'utf8');
    config = JSON.parse(raw);
    const globalRule = config.headers.find((rule) => rule.source === '/(.*)');
    expect(globalRule, 'missing global header rule for /(.*)').toBeTruthy();
    expect(Array.isArray(globalRule?.headers)).toBe(true);
  });

  for (const headerName of REQUIRED_SECURITY_HEADERS) {
    it(`global rule includes ${headerName}`, async () => {
      const raw = await readFile(VERCEL_PATH, 'utf8');
      config = JSON.parse(raw);
      const globalRule = config.headers.find((rule) => rule.source === '/(.*)');
      const header = globalRule?.headers.find((h) => h.key === headerName);
      expect(header, `${headerName} is missing from the global rule`).toBeTruthy();
      expect(header?.value.length, `${headerName} value is empty`).toBeGreaterThan(0);
    });
  }

  it('uses exact security header values', async () => {
    const raw = await readFile(VERCEL_PATH, 'utf8');
    config = JSON.parse(raw);
    const globalRule = config.headers.find((rule) => rule.source === '/(.*)');
    const headers = Object.fromEntries(globalRule?.headers.map((header) => [header.key, header.value]) ?? []);
    expect(headers).toMatchObject({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    });
  });

  it('static assets have immutable Cache-Control headers', async () => {
    const raw = await readFile(VERCEL_PATH, 'utf8');
    config = JSON.parse(raw);
    const assetSources = ['/fonts/(.*)', '/assets/(.*)'];
    for (const source of assetSources) {
      const rule = config.headers.find((r) => r.source === source);
      expect(rule, `missing Cache-Control rule for ${source}`).toBeTruthy();
      const cacheHeader = rule?.headers.find((h) => h.key === 'Cache-Control');
      expect(cacheHeader?.value, `Cache-Control for ${source}`).toBe('public, max-age=86400');
    }
  });
});
