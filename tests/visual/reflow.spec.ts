import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/agent-toolkit/',
  '/agentic-workstation/',
  '/blog/',
  '/community/',
  '/create-awesome/',
  '/dotfiles/',
  '/open-source/',
  '/projects/',
  '/v/',
  '/404.html',
] as const;

test.describe('WCAG 1.4.10 reflow', () => {
  for (const route of routes) {
    test(`${route} does not scroll horizontally at 320px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(route);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 1;
      });
      expect(overflow, `${route} overflows horizontally at 320px`).toBe(false);
    });
  }
});
