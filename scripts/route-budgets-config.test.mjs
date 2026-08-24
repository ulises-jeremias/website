// @vitest-environment node
/**
 * O-19 — Generated-data pipeline: route budgets config validation
 *
 * Verifies config/route-budgets.json is structurally complete:
 * every static route has a budget entry, each entry covers both viewports
 * with positive numeric limits, and no orphaned entries exist.
 */
import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUDGET_PATH = resolve(ROOT, 'config', 'route-budgets.json');

// Static routes produced by the build (trailing-slash canonical form used by the budget script).
const EXPECTED_ROUTES = [
  '/',
  '/dotfiles/',
  '/agentic-workstation/',
  '/agent-toolkit/',
  '/agentic-harness/',
  '/v/',
  '/create-awesome/',
  '/community/',
  '/blog/',
  '/projects/',
  '/open-source/',
  '/404.html',
];

const VIEWPORTS = ['mobile', 'desktop'];
const BUDGET_KEYS = ['total', 'document', 'script', 'style', 'image', 'font', 'requests'];
// script and image can be 0 for JS-free or image-free routes
const NON_ZERO_KEYS = new Set(['total', 'document', 'style', 'font', 'requests']);

describe('route-budgets.json', () => {
  /** @type {{ policy: object; routes: Record<string, Record<string, Record<string, number>>> }} */
  let config;

  it('parses as valid JSON', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    expect(config).toBeTruthy();
    expect(typeof config).toBe('object');
  });

  it('has a policy block with a source reference', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    expect(typeof config.policy?.source).toBe('string');
    expect(config.policy.source.length).toBeGreaterThan(0);
  });

  it('covers every expected route', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    for (const route of EXPECTED_ROUTES) {
      expect(Object.keys(config.routes), `route-budgets.json is missing an entry for ${route}`).toContain(route);
    }
  });

  it('has no orphaned routes not in the expected list', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    for (const route of Object.keys(config.routes)) {
      expect(
        EXPECTED_ROUTES,
        `route-budgets.json has an entry for ${route} which is not a known static route`,
      ).toContain(route);
    }
  });

  it('each route has mobile and desktop budget entries', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    for (const [route, entry] of Object.entries(config.routes)) {
      for (const vp of VIEWPORTS) {
        expect(Object.keys(entry), `${route} is missing a "${vp}" budget block`).toContain(vp);
      }
    }
  });

  it('each viewport budget has all required keys with positive numbers', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    for (const [route, entry] of Object.entries(config.routes)) {
      for (const [vp, budget] of Object.entries(entry)) {
        for (const key of BUDGET_KEYS) {
          expect(typeof budget[key], `${route} / ${vp} / ${key} must be a number`).toBe('number');
          if (NON_ZERO_KEYS.has(key)) {
            expect(budget[key], `${route} / ${vp} / ${key} must be positive`).toBeGreaterThan(0);
          } else {
            expect(budget[key], `${route} / ${vp} / ${key} must be non-negative`).toBeGreaterThanOrEqual(0);
          }
        }
      }
    }
  });

  it('total for each viewport is greater than any individual category', async () => {
    const raw = await readFile(BUDGET_PATH, 'utf8');
    config = JSON.parse(raw);
    const categories = ['document', 'script', 'style', 'image', 'font'];
    for (const [route, entry] of Object.entries(config.routes)) {
      for (const [vp, budget] of Object.entries(entry)) {
        for (const cat of categories) {
          if (typeof budget[cat] !== 'number') continue;
          expect(budget.total, `${route} / ${vp}: total should be >= ${cat} (${budget[cat]})`).toBeGreaterThanOrEqual(
            budget[cat],
          );
        }
      }
    }
  });
});
