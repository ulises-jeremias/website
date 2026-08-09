import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://www.ulises-jeremias.dev';
const OUT = path.resolve('docs/design/visual-first/audit');
const routes = [
  ['home', '/'],
  ['dotfiles', '/dotfiles'],
  ['agentic-workstation', '/agentic-workstation'],
  ['agent-toolkit', '/agent-toolkit'],
  ['v', '/v'],
  ['create-awesome', '/create-awesome'],
  ['community', '/community'],
  ['blog', '/blog'],
  ['projects', '/projects'],
  ['open-source', '/open-source'],
  ['404', '/404.html'],
];

const sizes = [
  ['1440', { width: 1440, height: 1000 }],
  ['390', { width: 390, height: 844 }],
];

function countWords(text) {
  return (text.match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) || []).length;
}

async function measure(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('header, [role="banner"], nav.site-header, .site-header');
    const footer = document.querySelector('footer, [role="contentinfo"], .site-footer');
    const skip = new Set();
    for (const el of document.querySelectorAll('[aria-hidden="true"], script, style, noscript')) skip.add(el);

    const isHidden = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return true;
      if (el.closest('[hidden], [aria-hidden="true"]')) return true;
      // closed details content
      const det = el.closest('details');
      if (det && !det.open && !det.querySelector('summary')?.contains(el)) return true;
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
      if (!parent || skip.has(parent) || isHidden(parent) || inChrome(parent)) continue;
      const t = node.textContent.replace(/\s+/g, ' ').trim();
      if (t) visibleText += t + ' ';
    }

    const main = document.querySelector('main') || document.body;
    const paragraphs = [...main.querySelectorAll('p')].filter(
      (p) => !isHidden(p) && !inChrome(p) && p.innerText.trim().length > 40,
    ).length;
    const cards = [...main.querySelectorAll('[class*="card"], article, .panel')].filter(
      (el) => !isHidden(el) && !inChrome(el),
    ).length;
    const lists = [...main.querySelectorAll('ul, ol')].filter((el) => !isHidden(el) && !inChrome(el)).length;
    const diagrams = [...main.querySelectorAll('svg, [role="img"], canvas, .diagram, [class*="diagram"]')].filter(
      (el) => !isHidden(el) && !inChrome(el),
    ).length;
    const interactive = [
      ...main.querySelectorAll(
        'button, [role="tab"], [role="radio"], input[type="radio"], details, [data-interactive]',
      ),
    ].filter((el) => !isHidden(el) && !inChrome(el)).length;
    const h1 = main.querySelector('h1')?.innerText?.trim() || '';
    const ctas = [...main.querySelectorAll('a.button, a[class*="cta"], .cta a, a.btn')]
      .slice(0, 5)
      .map((a) => a.innerText.trim())
      .filter(Boolean);

    return {
      visibleText,
      paragraphs,
      cards,
      lists,
      diagrams,
      interactive,
      h1,
      ctas,
      title: document.title,
    };
  });
}

const browser = await chromium.launch({ headless: true });
const results = {};

for (const [name, route] of routes) {
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();
  const url = BASE + route;
  console.log('VISIT', url);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  await page.waitForTimeout(800);

  // measure at desktop
  await page.setViewportSize(sizes[0][1]);
  await page.waitForTimeout(300);
  const m = await measure(page);
  const words = (m.visibleText.match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) || []).length;
  results[name] = {
    route,
    url,
    title: m.title,
    h1: m.h1,
    words,
    paragraphs: m.paragraphs,
    cards: m.cards,
    lists: m.lists,
    diagrams: m.diagrams,
    interactive: m.interactive,
    ctas: m.ctas,
    sample: m.visibleText.slice(0, 600),
  };

  for (const [label, size] of sizes) {
    await page.setViewportSize(size);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, `${label}.png`), fullPage: false });
  }
  await context.close();
}

fs.writeFileSync(path.join(OUT, '_metrics.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.words])), null, 2));
await browser.close();
