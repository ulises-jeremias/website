import { expect, test } from '@playwright/test';

test.describe('About systems-builder story', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`shows the interactive systems orbit on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/about');

      const orbit = page.locator('.about-orbit');
      const nodes = orbit.locator('a.about-orbit__station');
      await expect(orbit.getByText('A builder’s systems orbit')).toBeVisible();
      await expect(nodes).toHaveCount(5);
      await expect
        .poll(() => nodes.evaluateAll((items) => items.map((item) => item.getAttribute('aria-label'))))
        .toEqual([
          'Developer tooling: jump to this part of the build trajectory',
          'V + scientific computing: jump to this part of the build trajectory',
          'App composition: jump to this part of the build trajectory',
          'Linux systems: jump to this part of the build trajectory',
          'Agentic workflows: jump to this part of the build trajectory',
        ]);

      const firstNode = nodes.first();
      const bounds = await firstNode.boundingBox();
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
      await expect(orbit.locator('.about-orbit__trace').first()).toHaveCSS('stroke-dashoffset', '0px');
      await expect(orbit.locator('.about-orbit__halo')).toHaveCSS('animation-name', 'none');
      await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
      await expect(orbit).toHaveScreenshot(`about-systems-orbit-${viewport.name}.png`, {
        animations: 'disabled',
      });
    });
  }

  test('animates the orbital trace and links each station to its story', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/about');

    const orbit = page.locator('.about-orbit');
    await expect(orbit.locator('.about-orbit__trace').first()).toHaveCSS('animation-name', 'about-orbit-trace');
    await expect(orbit.locator('.about-orbit__halo')).toHaveCSS('animation-name', 'about-orbit-rotate');
    const linuxStop = orbit.getByRole('link', { name: /Linux systems:/ });
    await linuxStop.focus();
    await expect(linuxStop).toBeFocused();
    await expect(linuxStop).toHaveAttribute('href', '#trajectory-linux');
    await linuxStop.click();
    await expect(page).toHaveURL(/#trajectory-linux$/);
    await expect(page.locator('#trajectory-linux')).toBeInViewport();
  });

  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`keeps the identity and five-stage path readable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/about');

      await expect(page.getByRole('heading', { level: 1, name: 'Ulises Jeremias' })).toBeVisible();
      await expect(page.getByText('Solutions Architect @ NaNLABS · open-source builder')).toBeVisible();

      const orbitNodes = page.locator('.about-orbit__station');
      await expect(orbitNodes).toHaveCount(5);
      const orbitNode = await orbitNodes.first().boundingBox();
      expect(orbitNode?.height).toBeGreaterThanOrEqual(44);

      const path = page.getByTestId('about-build-path');
      const stops = path.locator('ol > li');
      await expect(stops).toHaveCount(5);
      await expect(path.getByRole('link')).toHaveText([
        'Developer tooling',
        'V + scientific computing',
        'App composition',
        'Linux systems',
        'Agentic workflows',
      ]);
      const nodeColors = await path
        .locator('.about-path__node')
        .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
      expect(new Set(nodeColors).size).toBe(5);

      const documentWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
      expect(documentWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(width);

      const stopTops = await stops.evaluateAll((items) =>
        items.map((item) => Math.round(item.getBoundingClientRect().top)),
      );
      expect(stopTops).toEqual([...stopTops].sort((a, b) => a - b));
      expect(new Set(stopTops).size).toBe(5);

      const stations = page.getByTestId('about-trajectory').locator(':scope > li');
      await expect(stations).toHaveCount(5);
      for (const station of await stations.all()) {
        await expect(station.locator('article')).toBeVisible();
      }
    });
  }

  test('keeps role groups, provenance, principles, and contact in static page content', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { level: 2, name: 'Roles and provenance' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Work', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Open source', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Community', exact: true })).toBeVisible();
    await expect(page.getByText(/work I own, work I maintain within organizations/i)).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'What I care about' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ulisescf.24@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:ulisescf.24@gmail.com',
    );
  });

  test('preserves visible keyboard focus and the static path in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await page.goto('/about');

    const link = page.getByTestId('about-build-path').getByRole('link', { name: 'Developer tooling' });
    await link.focus();
    const outline = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
    });

    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThanOrEqual(2);
    const orbitLink = page.locator('.about-orbit__station').first();
    await orbitLink.focus();
    const orbitOutline = await orbitLink.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
    });
    expect(orbitOutline.style).not.toBe('none');
    expect(orbitOutline.width).toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId('about-trajectory').locator(':scope > li')).toHaveCount(5);
  });

  test('tracks the stage at the reading line without moving the page and supports reduced motion', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/about');

    const path = page.getByTestId('about-build-path');
    const pathStops = path.locator('.about-path__stops');
    const stations = page.getByTestId('about-trajectory').locator(':scope > li');
    const stops = path.locator('.about-path__stop');
    await expect(stops).toHaveCount(5);
    await expect(stops.locator('[aria-current="step"]')).toHaveCount(0);

    let lastProgress = 0;
    for (const station of await stations.all()) {
      const stageId = (await station.getAttribute('id'))!;
      await station.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      const scrollAtStage = await page.evaluate(() => window.scrollY);
      await expect(path.locator(`a[href="#${stageId}"]`)).toHaveAttribute('aria-current', 'step');
      await expect(page.locator('.about-station[data-current="true"]')).toHaveCount(1);
      await expect(station).toHaveAttribute('data-current', 'true');
      const progress = await pathStops.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).getPropertyValue('--path-progress')),
      );
      expect(progress).toBeGreaterThan(lastProgress);
      lastProgress = progress;
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollAtStage);

      const documentWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
      expect(documentWidth).toBeLessThanOrEqual(320);
      const transitionDuration = await path
        .locator(`a[href="#${stageId}"] .about-path__node`)
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration));
      expect(transitionDuration).toBeLessThanOrEqual(0.001);
      const traceDuration = await pathStops.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element, '::after').transitionDuration),
      );
      expect(traceDuration).toBeLessThanOrEqual(0.001);
      const stationMarkerDuration = await station
        .locator('article')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element, '::before').transitionDuration));
      expect(stationMarkerDuration).toBeLessThanOrEqual(0.001);
    }

    const reverseTarget = stations.first();
    await reverseTarget.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect(reverseTarget).toHaveAttribute('data-current', 'true');
    const reverseProgress = await pathStops.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).getPropertyValue('--path-progress')),
    );
    expect(reverseProgress).toBeLessThan(lastProgress);
  });

  test('draws the reading trace between active stages with motion enabled', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/about');
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });

    const path = page.getByTestId('about-build-path');
    const stops = path.locator('.about-path__stops');
    const stages = page.getByTestId('about-trajectory').locator(':scope > li');
    await stages.nth(0).evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect(stages.nth(0)).toHaveAttribute('data-current', 'true');
    const animations = await page.evaluate(() =>
      document.getAnimations().map((animation) => ({
        state: animation.playState,
        duration: animation.effect?.getTiming().duration,
      })),
    );
    expect(animations).toContainEqual({ state: 'running', duration: 520 });
    expect(animations).toContainEqual({ state: 'running', duration: 320 });

    await stages.nth(3).evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect(stages.nth(3)).toHaveAttribute('data-current', 'true');
    const progress = await stops.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).getPropertyValue('--path-progress')),
    );
    const endpoint = await stops.locator('.about-path__stop:last-child .about-path__node').evaluate((element) => {
      const node = element.getBoundingClientRect();
      const list = element.closest('.about-path__stops')!.getBoundingClientRect();
      return node.top + node.height / 2 - list.top;
    });
    expect(progress).toBeLessThan(endpoint);
  });

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`captures the active reading station on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/about');

      const activeStation = page.locator('#trajectory-composition');
      await activeStation.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await expect(activeStation).toHaveAttribute('data-current', 'true');
      // This state includes a long responsive paragraph; Chromium's CI font
      // renderer changed 8% of mobile pixels through line wrapping alone.
      const screenshotOptions = viewport.name === 'mobile' ? { maxDiffPixelRatio: 0.12 } : {};
      await expect(page).toHaveScreenshot(`about-active-station-${viewport.name}.png`, screenshotOptions);
    });
  }

  test('keeps the active route map beside the reading path on wide screens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/about');

    const path = page.getByTestId('about-build-path');
    await expect(path).toHaveCSS('position', 'sticky');
    const stations = await page.getByTestId('about-trajectory').locator(':scope > li').all();
    for (const station of stations) {
      const stageId = (await station.getAttribute('id'))!;
      await station.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await expect(path.locator(`a[href="#${stageId}"]`)).toHaveAttribute('aria-current', 'step');
      await expect(station).toHaveAttribute('data-current', 'true');
    }

    const [pathTop, headerBottom] = await Promise.all([
      path.evaluate((element) => element.getBoundingClientRect().top),
      page.getByTestId('site-header').evaluate((element) => element.getBoundingClientRect().bottom),
    ]);
    expect(pathTop).toBeGreaterThanOrEqual(headerBottom);
    expect(pathTop).toBeLessThan(100);
  });

  test('keeps every trajectory link usable without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/about');

    const path = page.getByTestId('about-build-path');
    await expect(path.getByRole('link')).toHaveCount(5);
    await expect(path.locator('[aria-current="step"]')).toHaveCount(0);
    await expect(page.locator('.about-orbit__station')).toHaveCount(5);
    await expect(page.getByTestId('about-trajectory').locator(':scope > li')).toHaveCount(5);

    await context.close();
  });
});
