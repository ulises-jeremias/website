/**
 * O-17 — Internal link integrity
 *
 * Verifies every internal href rendered on each primary route resolves with
 * an HTTP 2xx response against the production build served by the webServer.
 */
import { expect, test } from '@playwright/test';

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
  '/agentic-harness',
  '/404.html',
] as const;

test.describe('Internal link integrity', () => {
  test('all internal hrefs on every primary route resolve with HTTP 2xx', async ({ page, request }) => {
    const checked = new Set<string>();
    const failures: string[] = [];

    for (const route of PRIMARY_ROUTES) {
      await page.goto(route);

      const hrefs = await page
        .locator('a[href]')
        .evaluateAll<string[], HTMLAnchorElement>((anchors) => [
          ...new Set(
            anchors
              .map((a) => a.getAttribute('href') ?? '')
              .filter((h) => h.startsWith('/') && !h.startsWith('//') && h !== '/404'),
          ),
        ]);

      for (const href of hrefs) {
        const path = href.split('#')[0] || '/';
        if (checked.has(path)) continue;
        checked.add(path);

        const response = await request.get(path, { failOnStatusCode: false });
        if (response.status() >= 400) {
          failures.push(`${path} (found on ${route}) → HTTP ${response.status()}`);
        }
      }
    }

    expect(failures, failures.length > 0 ? `Broken internal links:\n${failures.join('\n')}` : '').toHaveLength(0);
  });
});
