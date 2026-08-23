/**
 * WCAG contrast probe for the static site.
 *
 * Computes the effective contrast ratio of every visible text node (and SVG
 * <text>) against its nearest solid background, so we can catch the muted-text
 * and SVG-label failures that axe-core reports as `incomplete` (it cannot
 * evaluate SVG text or gradient fills).
 *
 * Usage:  pnpm build && node scripts/check-contrast.mjs [port]
 * Output: .lighthouse/contrast-report.json (exit 1 when sub-threshold text exists)
 *
 * Thresholds: 4.5:1 normal text, 3:1 large text (>= 24px or >= 18.66px bold).
 */
import { chromium } from 'playwright';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const PORT = Number(process.argv[2] ?? 4598);
const DIST = new URL('../dist/', import.meta.url).pathname;
const ROUTES = [
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
];

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    if (path === '' || path.endsWith('/')) path += 'index.html';
    const data = await readFile(join(DIST, path));
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

// Fully self-contained: runs inside the browser via page.evaluate.
const probeSource = `(() => {
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return p.length >= 3 ? [p[0], p[1], p[2], p[3] ?? 1] : null;
  };
  const lum = (c) => {
    const f = (v) => { const n = v / 255; return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  };
  const solidBg = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c[3] > 0.9) return c;
      node = node.parentElement;
    }
    return parse(getComputedStyle(document.body).backgroundColor) ?? [4, 2, 18, 1];
  };
  const isLarge = (el) => {
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    const weight = parseInt(s.fontWeight, 10) || 400;
    return size >= 24 || (size >= 18.66 && weight >= 700);
  };
  const isSvgText = (el) => el.namespaceURI === 'http://www.w3.org/2000/svg' && el.tagName.toLowerCase() === 'text';
  const out = [];
  const manual = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const el = walker.currentNode.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (el.closest('script, style, noscript, [aria-hidden="true"]')) continue;
    if (!(walker.currentNode.textContent || '').trim()) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const color = parse(isSvgText(el) ? style.fill : style.color);
    if (!color) continue;
    if (color[3] === 0) {
      manual.push({ text: (walker.currentNode.textContent || '').trim().slice(0, 60), tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal) || el.className || '' });
      continue;
    }
    const bg = solidBg(el);
    const r = ratio(color, bg);
    const threshold = isLarge(el) ? 3 : 4.5;
    if (r < threshold) {
      out.push({
        text: (walker.currentNode.textContent || '').trim().slice(0, 60),
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.baseVal) || el.className || '',
        color: isSvgText(el) ? style.fill : style.color,
        bg: bg.slice(0, 3).join(','),
        ratio: Number(r.toFixed(2)),
        threshold,
      });
    }
  }
  return { violations: out, manual };
})();`;

server.listen(PORT, '127.0.0.1', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const byRoute = {};
  let total = 0;
  let manualTotal = 0;
  for (const route of ROUTES) {
    await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle' });
    const results = await page.evaluate(probeSource);
    byRoute[route] = results;
    total += results.violations.length;
    manualTotal += results.manual.length;
  }
  await browser.close();
  server.close();

  await mkdir(join(process.cwd(), '.lighthouse'), { recursive: true });
  await writeFile(
    join(process.cwd(), '.lighthouse/contrast-report.json'),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), thresholds: { normal: 4.5, large: 3 }, total, manualTotal, byRoute },
      null,
      2,
    ),
  );

  for (const [route, items] of Object.entries(byRoute)) {
    for (const item of items.violations) {
      console.log(
        `${route}  ${item.ratio}:1  <${item.tag}.${item.cls}>  "${item.text}"  (${item.color} on ${item.bg})`,
      );
    }
    for (const item of items.manual) {
      console.log(
        `${route}  [manual]  <${item.tag}.${item.cls}>  "${item.text}"  (gradient/clipped text — verify visually)`,
      );
    }
  }
  console.log(`\nSub-threshold text nodes: ${total} · manual (gradient/clipped): ${manualTotal}`);
  process.exit(total > 0 ? 1 : 0);
});
