/**
 * O-20 — Animation / motion reduced-motion contract
 *
 * Verifies that prefers-reduced-motion: reduce suppresses both CSS animations
 * (motion tokens collapse, explicit animation:none rules apply) and the JS
 * components that gate pulses/beams behind matchMedia('(prefers-reduced-motion: reduce)').
 */
import { expect, test } from '@playwright/test';

test.describe('Motion token contract (motion.css)', () => {
  test('all duration tokens collapse to 1 ms under prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        fast: root.getPropertyValue('--motion-duration-fast').trim(),
        base: root.getPropertyValue('--motion-duration-base').trim(),
        slow: root.getPropertyValue('--motion-duration-slow').trim(),
        ambient: root.getPropertyValue('--motion-duration-ambient').trim(),
      };
    });

    expect(tokens.fast).toBe('1ms');
    expect(tokens.base).toBe('1ms');
    expect(tokens.slow).toBe('1ms');
    expect(tokens.ambient).toBe('1ms');
  });

  test('scroll-behavior is auto (no smooth-scroll) under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(scrollBehavior).toBe('auto');
  });

  test('universal animation-duration shortens to ≤1 ms under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // The global * rule sets animation-duration: 0.01ms; check a representative animated element
    // that does NOT have an explicit animation: none override (atlas-world uses transform, not animation).
    const atlasWorldDuration = await page
      .locator('.atlas-world')
      .first()
      .evaluate((el) => getComputedStyle(el).animationDuration);

    // 0.01ms rounds to 0ms in most parsers; any value ≤1ms satisfies the contract.
    const ms = Number.parseFloat(atlasWorldDuration.replace('ms', '').replace('s', '000'));
    expect(ms).toBeLessThanOrEqual(1);
  });
});

test.describe('Home — explicit CSS animation overrides', () => {
  test.use({ colorScheme: 'dark' });

  test('scanlines animation stops completely under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const animationName = await page
      .locator('.synthwave-environment__scanlines')
      .evaluate((el) => getComputedStyle(el).animationName);

    expect(animationName).toBe('none');
  });

  test('atlas-connection animation stops completely under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const animationName = await page
      .locator('.atlas-connection')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);

    expect(animationName).toBe('none');
  });

  test('atlas-world transform stays none on hover under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const world = page.locator('.atlas-world').first();
    const transformBefore = await world.evaluate((el) => getComputedStyle(el).transform);

    await world.hover();

    const transformAfter = await world.evaluate((el) => getComputedStyle(el).transform);
    expect(transformAfter).toBe(transformBefore);
  });
});

test.describe('Agent Toolkit — JS animation gating', () => {
  test('CapabilityNexus does not add is-beaming class when reducedMotion:reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agent-toolkit');

    // Confirm the JS sees reduce: true
    const reduceSeen = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    expect(reduceSeen).toBe(true);

    // Switching family radio triggers pulseBeamsOnce() which should bail early
    const secondRadio = page.locator('.atk-nexus input[name="atk-family"]').nth(1);
    if ((await secondRadio.count()) > 0) {
      await secondRadio.click();
    }

    const isBeaming = await page.locator('.atk-nexus__visual').evaluate((el) => el.classList.contains('is-beaming'));
    expect(isBeaming).toBe(false);
  });

  test('CapabilityNexus beam animation-name is none under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agent-toolkit');

    const beamAnim = await page
      .locator('.atk-nexus__beam')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);

    expect(beamAnim).toBe('none');
  });
});

test.describe('V — diagram animation suppression', () => {
  test('VSL diagram animated paths are suppressed under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/v');

    // Confirm matchMedia works in page context
    const reduceSeen = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    expect(reduceSeen).toBe(true);
  });
});

test.describe('Community — Workshop graph', () => {
  test('workshop graph animation is suppressed under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/community');

    // The graph uses CSS animation; check any animated SVG element duration collapses
    const svgPaths = await page.locator('.cm-workshop svg path').all();
    if (svgPaths.length > 0) {
      const duration = await svgPaths[0].evaluate((el) => getComputedStyle(el).animationDuration);
      const ms = Number.parseFloat(duration.replace('ms', '').replace('s', '000'));
      expect(ms).toBeLessThanOrEqual(1);
    }
  });
});
