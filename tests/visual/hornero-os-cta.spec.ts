import { expect, test } from '@playwright/test';

test('Hornero OS puts its official site before source and component paths', async ({ page }) => {
  await page.goto('/hornero-os');

  const officialSite = page.getByRole('link', { name: 'Visit Hornero OS' });
  await expect(officialSite).toHaveAttribute('href', 'https://horneroos.com');
  await expect(officialSite).toHaveAttribute('target', '_blank');
  await expect(officialSite).toHaveClass(/hos-cta--primary/);

  await expect(page.getByRole('link', { name: 'Try the components' })).toHaveAttribute('href', '#try');
  await expect(page.locator('.hos-cta--quiet')).toHaveAttribute('href', 'https://github.com/HorneroOS/hornero');
});

test('Hornero OS traces the real manifest stages on request', async ({ page }) => {
  await page.goto('/hornero-os');

  const manifest = page.locator('.hos-yaml');
  const traceButton = page.getByRole('button', { name: 'Trace manifest assembly' });
  await expect(traceButton).toBeVisible();
  await traceButton.click();
  await expect(manifest).toHaveAttribute('data-trace-state', 'running');
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(1);
  await expect(manifest.locator('.hos-yaml__slot--pinned').first()).toHaveClass(/is-current/);
  await expect(manifest).toHaveAttribute('data-trace-state', 'complete', { timeout: 5000 });
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(5);
});

test('Hornero OS keeps the manifest trace still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/hornero-os');

  const manifest = page.locator('.hos-yaml');
  await page.getByRole('button', { name: 'Trace manifest assembly' }).click();

  await expect(manifest).toHaveAttribute('data-trace-state', 'complete');
  await expect(manifest.locator('.hos-yaml__slot')).toHaveCount(5);
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(5);
});

test('Hornero OS still exposes the full manifest without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  const page = await context.newPage();
  await page.goto('/hornero-os/');

  await expect(page.locator('.hos-yaml__slot')).toHaveCount(5);
  await expect(page.locator('.hos-yaml__slot--future')).toHaveCount(2);
  await expect(page.locator('.hos-yaml__slot--future').first()).toContainText('future slot');
  await expect(page.locator('[data-hos-trace]')).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);

  await context.close();
});
