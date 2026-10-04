import { expect, test } from '@playwright/test';
import { getHomepagePortfolioAreas } from '@/data/portfolio.js';

test.describe('homepage visual coverage', () => {
  test('desktop atlas composition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.atlas-world')).toHaveCount(10);
    await expect(page.locator('#project-atlas')).toBeVisible();
    await expect(page.locator('#project-atlas-guide')).toBeVisible();
    await expect(page.locator('.nest-status')).toBeVisible();
    await expect(page.locator('.about-panel')).toBeVisible();
    // The four-area Featured Work section replaced the legacy ledger (#402).
    await expect(page.locator('.featured-areas')).toBeVisible();

    const featuredWork = page.getByRole('navigation', { name: 'Featured work' });
    await expect(featuredWork.getByRole('listitem')).toHaveCount(4);
    for (const area of getHomepagePortfolioAreas()) {
      await expect(featuredWork.getByRole('link', { name: area.title })).toHaveAttribute('href', area.path);
    }

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(overflow).toBe(false);

    await expect(page).toHaveScreenshot('home-desktop-1440.png', {
      fullPage: false,
    });
  });

  test('mobile recomposed narrative', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.atlas-world')).toHaveCount(10);
    await expect(page.locator('#project-atlas-guide')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Featured work' })).toBeHidden();
    await expect(page.locator('.featured-areas')).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(overflow).toBe(false);

    // The atlas and hero copy use proportional fonts that rasterize differently across CI/local Chromium.
    await expect(page).toHaveScreenshot('home-mobile-390.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.07,
    });
  });

  test('tablet breakpoint keeps featured destinations available before the mobile reflow', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/');

    const featuredWork = page.getByRole('navigation', { name: 'Featured work' });
    await expect(featuredWork).toBeVisible();
    await expect(featuredWork.getByRole('link')).toHaveCount(4);

    await page.setViewportSize({ width: 1023, height: 900 });
    await expect(featuredWork).toBeHidden();
    await expect(page.locator('.featured-areas')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });

  test('mobile navigation opens without trapping focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    await expect(page.getByRole('button', { name: 'Close navigation' }).first()).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Navigate the atlas' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary (compact)', exact: true })).toHaveCount(0);

    await expect(page).toHaveScreenshot('home-mobile-nav-open.png', {
      fullPage: false,
    });
  });

  test('mobile: hero quote stays in the hero; atlas renders later as secondary exploration (#403)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const order = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const atlas = document.querySelector('.nest-explore > .nest-explore__atlas > .project-atlas');
      if (!hero || !atlas) return null;
      return {
        atlasOutsideHero: !hero.contains(atlas),
        domAfterHero: Boolean(hero.compareDocumentPosition(atlas) & Node.DOCUMENT_POSITION_FOLLOWING),
      };
    });

    expect(order).not.toBeNull();
    expect(order?.atlasOutsideHero).toBe(true);
    expect(order?.domAfterHero).toBe(true);
    // The textual route list precedes the visual map.
    await expect(page.locator('.nest-explore__routes a').first()).toBeVisible();
    await expect(page.locator('#project-atlas')).toBeVisible();
  });

  test('reduced-motion keeps a complete static composition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');

    await expect(page.locator('.synthwave-environment')).toBeVisible();
    await expect(page.locator('.atlas-world')).toHaveCount(10);

    await expect(page).toHaveScreenshot('home-desktop-reduced-motion.png', {
      fullPage: false,
    });
  });
});
