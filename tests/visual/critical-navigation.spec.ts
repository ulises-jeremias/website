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
  '/about',
  '/agentic',
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
  '/hornero-os',
  '/sponsor',
  '/404.html',
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

test('primary navigation active state uses the current world accent', async ({ page }) => {
  const routes = ['/dotfiles', '/create-awesome', '/v', '/hornero-os', '/about', '/open-source'];
  const accents = new Set<string>();

  for (const route of routes) {
    await page.goto(route);
    const activeLink = page.locator('.site-header__desktop-nav a[aria-current="page"]');
    await expect(activeLink).toHaveCount(1);

    const [activeColor, shellAccent] = await Promise.all([
      activeLink.evaluate((element) => getComputedStyle(element).color),
      page.locator('.site-header').evaluate((element) => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--header-world-accent)';
        element.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      }),
    ]);

    expect(activeColor).toBe(shellAccent);
    accents.add(activeColor);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-mobile-trigger]').click();
    const mobileActiveLink = page.locator('.mobile-nav__link[aria-current="page"]');
    await expect(mobileActiveLink).toHaveCount(1);
    await expect
      .poll(() => mobileActiveLink.evaluate((element) => getComputedStyle(element).borderInlineStartColor))
      .toBe(activeColor);
  }

  expect(accents.size).toBe(routes.length);
});

test('compact navigation has touch-sized links and a world-color active signal', async ({ page }) => {
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/create-awesome');

    const navigation = page.getByRole('navigation', { name: 'Primary (compact)' });
    await expect(navigation).toBeVisible();

    const targets = await navigation.getByRole('link').evaluateAll((links) =>
      links.map((link) => {
        const bounds = link.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      }),
    );
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.every(({ width: targetWidth, height }) => targetWidth >= 44 && height >= 44)).toBe(true);

    const activeLink = navigation.locator('a[aria-current="page"]');
    await expect(activeLink).toHaveCount(1);
    const activeColors = await activeLink.evaluate((link) => {
      const style = getComputedStyle(link);
      return { color: style.color, indicator: style.borderBlockEndColor, thickness: style.borderBlockEndWidth };
    });
    expect(activeColors.indicator).toBe(activeColors.color);
    expect(activeColors.thickness).toBe('2px');
  }
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`carries the active world signal between documents on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      window.addEventListener('pageswap', (event) => {
        window.sessionStorage.setItem('__routeSignalTransition', String(Boolean(event.viewTransition)));
      });
    });
    await page.goto('/projects/');

    const activeSelector =
      viewport.width >= 860
        ? '.site-header__desktop-nav a[aria-current="page"]'
        : '.site-header__compact-nav a[aria-current="page"]';
    const sourceSignal = page.locator(activeSelector);
    await expect(sourceSignal).toHaveCount(1);
    await expect.poll(() => sourceSignal.evaluate((link) => getComputedStyle(link).viewTransitionName)).toBe('route');

    const destination = page.locator(
      `${viewport.width >= 860 ? '.site-header__desktop-nav' : '.site-header__compact-nav'} a[href="/open-source"]`,
    );
    await destination.click();
    await expect(page).toHaveURL(/\/open-source\/?$/);
    await expect(page.locator(activeSelector)).toHaveAttribute('aria-current', 'page');
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('__routeSignalTransition'))).toBe('true');
  });
}

test('reduced motion keeps cross-route active signal still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/');

  const activeLink = page.locator('.site-header__desktop-nav a[aria-current="page"]');
  await expect(activeLink).toHaveCount(1);
  await expect.poll(() => activeLink.evaluate((link) => getComputedStyle(link).viewTransitionName)).toBe('none');
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
      await expect(trigger).toHaveAccessibleName('Menu');
      await expect(trigger).not.toHaveAttribute('aria-label');

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
