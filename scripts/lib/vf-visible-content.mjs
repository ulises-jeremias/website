/**
 * Canonical visible-content measurement for visual-first audits.
 *
 * Counts approximate words in the document body while excluding:
 * - site chrome (header / banner / footer / contentinfo)
 * - non-rendered nodes: script, style, noscript, [aria-hidden="true"]
 * - display:none / visibility:hidden / opacity:0 / [hidden] / closed <details> bodies
 *
 * Word count is a regression signal, not an acceptance KPI.
 */

/**
 * Playwright page.evaluate payload — returns { words, paragraphs, sample }.
 * Keep this self-contained (no imports) so it can be serialized into the browser.
 */
export function visibleContentMeasureSource() {
  return () => {
    const nav = document.querySelector('header, [role="banner"], nav.site-header, .site-header');
    const footer = document.querySelector('footer, [role="contentinfo"], .site-footer');
    const skip = new Set();
    for (const el of document.querySelectorAll('[aria-hidden="true"], script, style, noscript')) {
      skip.add(el);
    }

    const isHidden = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return true;
      if (el.closest('[hidden], [aria-hidden="true"]')) return true;
      const det = el.closest('details');
      if (det && !det.open) {
        const summary = det.querySelector('summary');
        if (!summary || !summary.contains(el)) return true;
      }
      return false;
    };

    const inChrome = (el) => {
      if (nav && nav.contains(el)) return true;
      if (footer && footer.contains(el)) return true;
      return false;
    };

    let visibleText = '';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || skip.has(parent) || parent.closest('script, style, noscript')) continue;
      if (isHidden(parent) || inChrome(parent)) continue;
      const t = node.textContent.replace(/\s+/g, ' ').trim();
      if (t) visibleText += `${t} `;
    }

    const main = document.querySelector('main') || document.body;
    const paragraphs = [...main.querySelectorAll('p')].filter(
      (p) => !isHidden(p) && !inChrome(p) && p.innerText.trim().length > 40,
    ).length;

    const words = (visibleText.match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) || []).length;
    return { words, paragraphs, sample: visibleText.slice(0, 800) };
  };
}

/** Convenience for Playwright: `await measureVisibleContent(page)`. */
export async function measureVisibleContent(page) {
  return page.evaluate(visibleContentMeasureSource());
}
