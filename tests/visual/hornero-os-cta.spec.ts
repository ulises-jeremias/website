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
