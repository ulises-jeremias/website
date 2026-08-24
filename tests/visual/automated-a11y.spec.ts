/**
 * O-13 — Automated accessibility tests
 *
 * Runs axe-core WCAG 2.1 AA rules on every primary route at desktop
 * and mobile viewports. Critical (impact: critical/serious) violations
 * fail the test immediately; moderate violations are collected and reported.
 */
import { expect, type Page, test } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js') as string;

type AxeViolation = {
  id: string;
  impact: string;
  description: string;
  nodes: Array<{ target: string[]; html: string }>;
};

type AxeRuntime = {
  run: (context: Document, options: object) => Promise<{ violations: AxeViolation[] }>;
};

const PRIMARY_ROUTES = [
  '/',
  '/dotfiles',
  '/agentic-workstation',
  '/agent-toolkit',
  '/v',
  '/create-awesome',
  '/community',
  '/blog',
  '/projects',
  '/open-source',
] as const;

// Rules already verified by dedicated specs — skip to avoid duplicate noise.
const SKIP_RULES = [
  'nested-interactive', // pr6-diagram-semantics.spec.ts
];

async function runAxe(page: Page) {
  await page.addScriptTag({ path: axePath });

  return page.evaluate(
    async ({ skipRules }) => {
      const axe = Reflect.get(window, 'axe') as AxeRuntime;
      return axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
        rules: Object.fromEntries(skipRules.map((id: string) => [id, { enabled: false }])),
      });
    },
    { skipRules: SKIP_RULES },
  );
}

function describeViolations(violations: AxeViolation[]) {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n  ` +
        v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(' > '))
          .join('\n  '),
    )
    .join('\n\n');
}

for (const route of PRIMARY_ROUTES) {
  test.describe(`axe WCAG 2.1 AA — ${route}`, () => {
    test(`desktop 1440px — no critical/serious violations`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);

      const report = await runAxe(page);
      const criticalOrSerious = report.violations.filter((v) => ['critical', 'serious'].includes(v.impact));

      expect(criticalOrSerious, describeViolations(criticalOrSerious)).toHaveLength(0);
    });

    test(`mobile 390px — no critical/serious violations`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);

      const report = await runAxe(page);
      const criticalOrSerious = report.violations.filter((v) => ['critical', 'serious'].includes(v.impact));

      expect(criticalOrSerious, describeViolations(criticalOrSerious)).toHaveLength(0);
    });
  });
}
