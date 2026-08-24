import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/agent-toolkit',
  '/dotfiles',
  '/agentic-workstation',
  '/v',
  '/create-awesome',
  '/community',
  '/blog',
  '/projects',
  '/open-source',
] as const;

test.describe('route smoke', () => {
  for (const route of routes) {
    test(`${route} renders shell at 1440`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(route);

      await expect(page.getByTestId('site-header')).toHaveCount(1);
      await expect(page.locator('h1').first()).toBeVisible();
    });

    test(`${route} recomposes at 390`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);

      await expect(page.locator('h1').first()).toBeVisible();
    });
  }
});

test.describe('flagship route visuals', () => {
  const captureRoutes = [
    { path: '/dotfiles', name: 'dotfiles' },
    { path: '/agentic-workstation', name: 'workstation' },
    { path: '/v', name: 'v' },
    { path: '/create-awesome', name: 'create-awesome' },
    { path: '/community', name: 'community' },
    { path: '/blog', name: 'blog' },
    { path: '/projects', name: 'projects' },
    { path: '/open-source', name: 'open-source' },
  ] as const;

  for (const route of captureRoutes) {
    test(`${route.name} desktop capture`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(route.path);
      await expect(page).toHaveScreenshot(`${route.name}-desktop-1440.png`, { fullPage: false });
    });

    test(`${route.name} mobile capture`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route.path);
      // Long proportional copy in V reflows slightly across CI/local font rasterizers.
      const screenshotOptions = route.name === 'v' ? { fullPage: false, maxDiffPixelRatio: 0.07 } : { fullPage: false };
      await expect(page).toHaveScreenshot(`${route.name}-mobile-390.png`, screenshotOptions);
    });
  }
});
