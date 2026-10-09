import { expect, test } from '@playwright/test';
import { getHomepagePortfolioAreas } from '@/data/portfolio.js';

test.describe('homepage visual coverage', () => {
  test('atlas worlds use decorative docking art with reduced-motion support', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const docks = page.locator('.atlas-world__dock');
    await expect(docks).toHaveCount(10);
    for (const dock of await docks.all()) {
      await expect(dock).not.toHaveAttribute('tabindex');
      await expect(dock.locator('img')).toHaveAttribute('alt', '');
      await expect(dock.locator('source[type="image/webp"]')).toHaveAttribute(
        'srcset',
        /island-atlas-dock-sm\.webp 440w, \/assets\/nest\/island-atlas-dock\.webp 640w/,
      );
    }

    const selectedDock = docks.first();
    await page.locator('.atlas-world').first().focus();
    await expect.poll(() => selectedDock.evaluate((dock) => getComputedStyle(dock).opacity)).toBe('1');
    await expect
      .poll(() => selectedDock.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(selectedDock).toBeVisible();
    await expect(selectedDock).toHaveCSS('transition-duration', '0s');
  });

  test('a project world has a layered platform with a static reduced-motion fallback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');

    const world = page.locator('.atlas-world[data-world-id="toolkit"]');
    const dock = world.locator('.atlas-world__dock');
    await expect(world.locator('.atlas-world__platform')).toHaveAttribute('aria-hidden', 'true');
    await expect(dock.locator('img')).toHaveAttribute('src', '/assets/island-atlas-dock-220.png');
    await expect
      .poll(() => dock.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
    await expect(world).toHaveScreenshot('atlas-world-platform-toolkit.png', { maxDiffPixelRatio: 0.025 });

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(world).toHaveScreenshot('atlas-world-platform-toolkit-mobile.png', { maxDiffPixelRatio: 0.025 });

    await page.setViewportSize({ width: 320, height: 844 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
      .toBe(true);
    await expect(world).toHaveScreenshot('atlas-world-platform-toolkit-320.png', { maxDiffPixelRatio: 0.025 });
  });

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

  test('featured worlds answer interaction with their own system motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');

    const signatures = [
      { area: 'agentic', transform: 'matrix(1, 0, 0, 1, 0, 0)' },
      { area: 'hornero', transform: 'matrix(1, 0, 0, 1, 0, -4)' },
      { area: 'v-ecosystem', transform: 'matrix(1, 0, 0, 1.12, 0, 0)' },
      { area: 'create-awesome', transform: 'matrix(1, 0, 0, 1, 5, 0)' },
    ];

    for (const signature of signatures) {
      const card = page.locator(`.featured-areas__card[data-area="${signature.area}"]`);
      await card.locator('.featured-areas__title a').focus();
      await expect(card.locator('.featured-areas__signal')).toHaveCSS('transform', signature.transform);
      await expect(card.locator('.featured-areas__signal')).toHaveCSS('transition-property', /transform/);
    }
  });

  test('featured worlds keep their complete, still visual response when reduced motion is enabled', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');

    const card = page.locator('.featured-areas__card[data-area="create-awesome"]');
    const link = card.locator('.featured-areas__title a');
    await link.focus();

    await expect(card.locator('.featured-areas__signal')).toHaveCSS('transition-duration', '0s');
    await expect(card).toHaveCSS('transform', 'none');
    await expect(card.locator('.featured-areas__art picture img')).toBeVisible();
    await expect(link).toBeFocused();
  });

  test('featured worlds recompose at 320px and keep every project link touch-sized', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/');

    const cards = page.locator('.featured-areas__card');
    await expect(cards).toHaveCount(4);
    await cards.first().scrollIntoViewIfNeeded();

    const measurements = await page.evaluate(() => ({
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      links: [...document.querySelectorAll('.featured-areas__card a')].map((link) => {
        const rect = link.getBoundingClientRect();
        return { label: link.textContent?.trim(), width: rect.width, height: rect.height };
      }),
      cardsFit: [...document.querySelectorAll('.featured-areas__card')].every(
        (card) => card.scrollWidth <= card.clientWidth + 1,
      ),
      artFitsSquare: [...document.querySelectorAll('.featured-areas__art')].every((art) => {
        const rect = art.getBoundingClientRect();
        return Math.abs(rect.width - rect.height) <= 1;
      }),
    }));

    expect(measurements.pageOverflow).toBe(false);
    expect(measurements.cardsFit).toBe(true);
    expect(measurements.artFitsSquare).toBe(true);
    expect(measurements.links.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  });

  test('featured portals keep their route-specific composition at desktop and mobile sizes', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const viewport of [
      { width: 1440, height: 1000, snapshot: 'home-featured-portals-desktop.png' },
      { width: 390, height: 844, snapshot: 'home-featured-portals-mobile.png' },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      const featured = page.locator('.featured-areas');
      await featured.scrollIntoViewIfNeeded();
      await expect(featured).toHaveScreenshot(viewport.snapshot, { animations: 'disabled' });
    }
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

    const toggle = page.locator('[data-mobile-trigger]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAccessibleName('Menu');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

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
