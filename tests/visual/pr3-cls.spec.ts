import { expect, test } from '@playwright/test';

test.describe('PR 3 Workstation first-view stability', () => {
  test('keeps the mobile first view stable across cold loads', async ({ browser }) => {
    const clsRuns: number[] = [];

    for (let run = 0; run < 3; run += 1) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        serviceWorkers: 'block',
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        (window as Window & { __layoutShifts?: number[] }).__layoutShifts = [];
        new PerformanceObserver((list) => {
          const shifts = (window as unknown as { __layoutShifts: number[] }).__layoutShifts;
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!shift.hadRecentInput) shifts.push(shift.value ?? 0);
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });

      await page.goto('/agentic-workstation/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const cls = await page.evaluate(() =>
        ((window as Window & { __layoutShifts?: number[] }).__layoutShifts ?? []).reduce(
          (total, value) => total + value,
          0,
        ),
      );
      clsRuns.push(cls);
      await context.close();
    }

    expect(clsRuns).toHaveLength(3);
    for (const cls of clsRuns) expect(cls).toBeLessThan(0.05);
  });
});
