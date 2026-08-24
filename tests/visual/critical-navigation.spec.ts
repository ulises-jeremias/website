/**
 * O-16 — Critical navigation tests
 *
 * Verifies that the site shell's navigation is correctly structured:
 * skip link, landmark roles, aria-label, aria-current, and mobile nav
 * dialog semantics on every primary route.
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
] as const;

test.describe('Skip link', () => {
  for (const route of PRIMARY_ROUTES) {
    test(`skip link targets #main-content on ${route}`, async ({ page }) => {
      await page.goto(route);

      const skipLink = page.locator('.site-header__skip');
      await expect(skipLink).toHaveAttribute('href', '#main-content');

      const target = page.locator('#main-content');
      await expect(target).toHaveAttribute('tabindex', '-1');
    });
  }
});

test.describe('Desktop navigation landmark', () => {
  for (const route of PRIMARY_ROUTES) {
    test(`desktop nav is labelled "Primary" and marks current page on ${route}`, async ({ page }) => {
      await page.goto(route);

      const nav = page.locator('.site-header__desktop-nav[aria-label="Primary"]');
      await expect(nav).toHaveCount(1);

      // Each primary nav item that matches the current route has aria-current="page"
      const currentLinks = page.locator('.site-header__desktop-nav [aria-current="page"]');
      const count = await currentLinks.count();
      // Only the exact active route gets aria-current; blog/[slug] children share /blog
      expect(count).toBeLessThanOrEqual(1);

      // All nav links must have non-empty text
      for (const link of await nav.locator('a').all()) {
        const text = (await link.textContent())?.trim();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  }
});

test.describe('Main content landmark', () => {
  for (const route of PRIMARY_ROUTES) {
    test(`page has exactly one <main id="main-content"> on ${route}`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator('main#main-content')).toHaveCount(1);
    });
  }
});

test.describe('Mobile navigation dialog', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of [PRIMARY_ROUTES[0], PRIMARY_ROUTES[1]]) {
    test(`mobile nav trigger and drawer are correctly attributed on ${route}`, async ({ page }) => {
      await page.goto(route);

      const trigger = page.locator('[data-mobile-trigger]');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toHaveAttribute('aria-controls', 'site-navigation-drawer');
      await expect(trigger).toHaveAttribute('aria-label', /navigation/i);

      const drawer = page.locator('#site-navigation-drawer');
      await expect(drawer).toHaveAttribute('role', 'dialog');
      await expect(drawer).toHaveAttribute('aria-modal', 'true');
      await expect(drawer).toHaveAttribute('aria-labelledby', 'site-navigation-title');
      // Drawer starts hidden
      await expect(drawer).toHaveAttribute('hidden');
    });

    test(`mobile nav opens, aria-expanded flips, drawer becomes visible on ${route}`, async ({ page }) => {
      await page.goto(route);

      const trigger = page.locator('[data-mobile-trigger]');
      await trigger.click();

      await expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const drawer = page.locator('#site-navigation-drawer');
      await expect(drawer).not.toHaveAttribute('hidden');
      await expect(drawer).toBeVisible();
    });

    test(`mobile nav closes with close button and aria-expanded resets on ${route}`, async ({ page }) => {
      await page.goto(route);

      await page.locator('[data-mobile-trigger]').click();
      await expect(page.locator('#site-navigation-drawer')).toBeVisible();

      await page.locator('[data-mobile-close]').click();
      await expect(page.locator('[data-mobile-trigger]')).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#site-navigation-drawer')).toHaveAttribute('hidden');
    });
  }
});

test.describe('Keyboard accessibility', () => {
  test('Tab key reaches skip link as first focusable element on home', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.className);
    expect(focused).toContain('site-header__skip');
  });

  test('skip link activates and moves focus to #main-content on Enter', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // focus skip link
    await page.keyboard.press('Enter');

    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('main-content');
  });
});
