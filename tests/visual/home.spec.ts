import { expect, test } from '@playwright/test';
import { getHomepagePortfolioAreas } from '@/data/portfolio.js';

test.describe('homepage visual coverage', () => {
  test('atlas responsive image descriptors match the intrinsic WebP widths', async ({ page }) => {
    await page.goto('/');

    const sources = page.locator('.atlas-world__visual source[type="image/webp"]');
    await expect(sources).toHaveCount(10);

    const mismatches = await sources.evaluateAll(async (elements) => {
      const results = await Promise.all(
        elements.flatMap((source) => {
          const srcset = source.getAttribute('srcset') ?? '';
          return srcset.split(',').map(async (candidate) => {
            const [url, descriptor] = candidate.trim().split(/\s+/);
            if (!url || !descriptor) throw new Error(`Invalid srcset candidate: ${candidate}`);
            const image = new Image();
            image.src = url;
            await image.decode();
            return { url, descriptor, intrinsicWidth: image.naturalWidth };
          });
        }),
      );

      return results.filter(({ descriptor, intrinsicWidth }) => descriptor !== `${intrinsicWidth}w`);
    });

    expect(mismatches).toEqual([]);
  });

  test('homepage hero falls back to the optimized JPEG when WebP is unsupported', async ({ page }) => {
    await page.goto('/');

    const heroImage = page.locator('.synthwave-environment__plate');
    await page
      .locator('.synthwave-environment source[type="image/webp"]')
      .evaluate((source) => source.setAttribute('type', 'image/x-digital-nest-unsupported'));

    await expect
      .poll(() => heroImage.evaluate((image: HTMLImageElement) => image.currentSrc))
      .toContain('/assets/hero-bg.jpg');
    await expect.poll(() => heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  });

  test('featured portal icons stay decorative while links keep visible names', async ({ page }) => {
    await page.goto('/');

    const portals = page.getByRole('navigation', { name: 'Featured work' });
    const links = portals.getByRole('link');
    const icons = portals.locator('.hero-portals__icon svg');
    await expect(links).toHaveCount(4);
    await expect(icons).toHaveCount(4);

    for (const area of getHomepagePortfolioAreas()) {
      await expect(links.filter({ hasText: area.title })).toHaveAccessibleName(new RegExp(area.title));
    }

    const iconAttributes = await icons.evaluateAll((elements) =>
      elements.map((icon) => ({
        hidden: icon.getAttribute('aria-hidden'),
        focusable: icon.getAttribute('focusable'),
        role: icon.getAttribute('role'),
        labelledBy: icon.getAttribute('aria-labelledby'),
      })),
    );
    expect(iconAttributes).toEqual(
      Array.from({ length: 4 }, () => ({ hidden: 'true', focusable: 'false', role: null, labelledBy: null })),
    );
  });

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
    const featuredWork = page.getByRole('navigation', { name: 'Featured work' });

    for (const width of [768, 1023, 1024, 1152, 1280, 1366]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      if (width >= 1024) {
        await expect(featuredWork).toBeVisible();
        await expect(featuredWork.getByRole('link')).toHaveCount(4);
      } else {
        await expect(featuredWork).toBeHidden();
        await expect(page.locator('.featured-areas')).toBeVisible();
      }

      const overflowingNameLines = await page.locator('.hero__name-line').evaluateAll((lines) =>
        lines
          .filter((line) => line.scrollWidth > line.clientWidth + 1)
          .map((line) => ({
            text: line.textContent?.trim(),
            scrollWidth: line.scrollWidth,
            clientWidth: line.clientWidth,
          })),
      );
      expect(overflowingNameLines, `hero title clipped at ${width}px`).toEqual([]);
    }

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
