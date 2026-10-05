/**
 * O-20 — Animation / motion reduced-motion contract
 *
 * Verifies that prefers-reduced-motion: reduce suppresses both CSS animations
 * (motion tokens collapse, explicit animation:none rules apply) and the JS
 * components that gate pulses/beams behind matchMedia('(prefers-reduced-motion: reduce)').
 */
import { expect, test } from '@playwright/test';

test.describe('Motion token contract (motion.css)', () => {
  test('all duration tokens collapse to 0 ms under prefers-reduced-motion: reduce', async ({ page }) => {
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

    expect(tokens.fast).toBe('0s');
    expect(tokens.base).toBe('0s');
    expect(tokens.slow).toBe('0s');
    expect(tokens.ambient).toBe('0s');
  });

  test('scroll-behavior is auto (no smooth-scroll) under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(scrollBehavior).toBe('auto');
  });

  test('universal animations and transitions stop under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const motionStyles = await page
      .locator('.atlas-world')
      .first()
      .evaluate((el) => {
        const style = getComputedStyle(el);
        return { animationName: style.animationName, transitionDuration: style.transitionDuration };
      });

    expect(motionStyles.animationName).toBe('none');
    expect(motionStyles.transitionDuration).toBe('0s');
  });
});

test.describe('Home — explicit CSS animation overrides', () => {
  test.use({ colorScheme: 'dark' });

  test('scanline texture stays static under reduced motion and clears in forced colors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const scanlines = page.locator('.synthwave-environment__scanlines');
    const defaultStyle = await scanlines.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        canonicalTexture: el.classList.contains('texture-scanline'),
        animationName: style.animationName,
        backgroundImage: style.backgroundImage,
        opacity: style.opacity,
      };
    });

    expect(defaultStyle.canonicalTexture).toBe(true);
    expect(defaultStyle.animationName).toBe('none');
    expect(defaultStyle.backgroundImage).not.toBe('none');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedMotionStyle = await scanlines.evaluate((el) => {
      const style = getComputedStyle(el);
      return { animationName: style.animationName, backgroundImage: style.backgroundImage, opacity: style.opacity };
    });
    expect(reducedMotionStyle).toEqual({
      animationName: 'none',
      backgroundImage: defaultStyle.backgroundImage,
      opacity: defaultStyle.opacity,
    });

    await page.emulateMedia({ forcedColors: 'active' });
    await expect.poll(() => scanlines.evaluate((el) => getComputedStyle(el).backgroundImage)).toBe('none');
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

    // Switching family radio triggers pulseBeamsOnce() which should bail early.
    // Use evaluate+dispatchEvent because the radio is visually hidden by its label overlay.
    const secondRadio = page.locator('.atk-nexus input[name="atk-family"]').nth(1);
    if ((await secondRadio.count()) > 0) {
      await secondRadio.evaluate((el) => {
        (el as HTMLInputElement).checked = true;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
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

test.describe('V — interactive scientific scene motion', () => {
  test('RxV emits its static stream state under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/v/#rxv');

    const scene = page.locator('[data-v-scene="rxv"]');
    await expect(scene.locator('[data-rxv-emit]')).toBeEnabled();
    await scene.locator('[data-rxv-emit]').click();

    const events = scene.locator('[data-rxv-events] circle');
    await expect(events).toHaveCount(4);
    for (const event of await events.all()) {
      await expect
        .poll(() => event.evaluate((el) => ({ radius: el.getAttribute('r'), animations: el.getAnimations().length })))
        .toEqual({ radius: '7', animations: 0 });
    }
    await expect(scene.locator('[data-v-scene-live]')).toHaveText('Demo burst emitted · stream complete (not live).');
  });
});
