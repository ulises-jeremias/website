import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/about',
  '/agentic',
  '/agent-toolkit',
  '/dotfiles',
  '/agentic-workstation',
  '/v',
  '/create-awesome',
  '/community',
  '/blog',
  '/projects',
  '/open-source',
  '/agentic-harness',
  '/hornero-os',
  '/sponsor',
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
    { path: '/about', name: 'about' },
    { path: '/agentic', name: 'agentic' },
    { path: '/agent-toolkit', name: 'agent-toolkit' },
    { path: '/agentic-harness', name: 'agentic-harness' },
    { path: '/dotfiles', name: 'dotfiles' },
    { path: '/agentic-workstation', name: 'workstation' },
    { path: '/v', name: 'v' },
    { path: '/create-awesome', name: 'create-awesome' },
    { path: '/community', name: 'community' },
    { path: '/blog', name: 'blog' },
    { path: '/projects', name: 'projects' },
    { path: '/open-source', name: 'open-source' },
    { path: '/hornero-os', name: 'hornero-os' },
    { path: '/sponsor', name: 'sponsor' },
    { path: '/404.html', name: 'not-found' },
  ] as const;

  for (const route of captureRoutes) {
    test(`${route.name} desktop capture`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(route.path);
      // Software rasterizers and system-font renderers can shift large painted
      // areas or masthead wrapping; tolerances stay scoped to reviewed routes.
      const desktopOptions =
        route.name === 'agentic-harness' || route.name === 'agent-toolkit'
          ? { fullPage: false, maxDiffPixelRatio: 0.12 }
          : route.name === 'dotfiles' || route.name === 'v'
            ? { fullPage: false, maxDiffPixelRatio: 0.1 }
            : route.name === 'agentic'
              ? { fullPage: false, maxDiffPixelRatio: 0.1 }
              : { fullPage: false };
      await expect(page).toHaveScreenshot(`${route.name}-desktop-1440.png`, desktopOptions);
    });

    test(`${route.name} mobile capture`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route.path);
      // These reviewed mobile routes reflow between the CI and local Chromium
      // font renderers. Keep the tolerance scoped to routes with measured diffs.
      const screenshotOptions = [
        'agentic',
        'v',
        'community',
        'projects',
        'agentic-harness',
        'agent-toolkit',
        'hornero-os',
        'sponsor',
        'dotfiles',
        'workstation',
        'create-awesome',
      ].includes(route.name)
        ? { fullPage: false, maxDiffPixelRatio: 0.12 }
        : { fullPage: false };
      await expect(page).toHaveScreenshot(`${route.name}-mobile-390.png`, screenshotOptions);
    });
  }
});
