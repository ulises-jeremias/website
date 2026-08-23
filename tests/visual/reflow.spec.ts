import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/agent-toolkit/',
  '/agentic-workstation/',
  '/blog/',
  '/community/',
  '/create-awesome/',
  '/dotfiles/',
  '/open-source/',
  '/projects/',
  '/v/',
  '/404.html',
] as const;

test.describe('WCAG 1.4.10 reflow', () => {
  for (const route of routes) {
    test(`${route} does not scroll horizontally at 320px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(route);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const viewport = doc.clientWidth;
        const offenders = [...document.querySelectorAll<HTMLElement>('*')]
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            let parent = element.parentElement;
            let hasScrollableAncestor = false;
            while (parent && parent !== document.body) {
              const parentStyle = getComputedStyle(parent);
              if (parentStyle.overflowX === 'auto' || parentStyle.overflowX === 'scroll') {
                hasScrollableAncestor = true;
                break;
              }
              parent = parent.parentElement;
            }
            return (
              !hasScrollableAncestor &&
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              rect.width > 0 &&
              rect.height > 0 &&
              (rect.left < -1 || rect.right > viewport + 1)
            );
          })
          .slice(0, 10)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: element.className,
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              text: (element.textContent ?? '').trim().slice(0, 48),
              ancestors: (() => {
                const values: Array<{ tag: string; className: string; overflowX: string }> = [];
                let parent = element.parentElement;
                while (parent && values.length < 4) {
                  values.push({
                    tag: parent.tagName.toLowerCase(),
                    className: parent.className,
                    overflowX: getComputedStyle(parent).overflowX,
                  });
                  parent = parent.parentElement;
                }
                return values;
              })(),
            };
          });
        return offenders;
      });
      expect(overflow, `${route} has visible horizontal overflow at 320px`).toEqual([]);
    });
  }
});
