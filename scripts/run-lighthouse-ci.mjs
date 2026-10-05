import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer as createHttpServer, get as httpGet } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import path, { extname, resolve, sep } from 'node:path';
import process from 'node:process';
import { brotliCompressSync, brotliDecompressSync, gunzipSync, gzipSync, constants as zlibConstants } from 'node:zlib';
import { inspectLighthouseThresholds } from './lighthouse-thresholds.mjs';

const root = process.cwd();
const chromePath = chromium.executablePath();
const configPath = path.join(root, 'config', 'lighthouse.json');
const reportPath = path.join(root, '.lighthouse', 'reports');
const distIndexPath = path.join(root, 'dist', 'index.html');
const distRoot = path.resolve(root, 'dist');
const portValue = process.env.LIGHTHOUSE_TEST_PORT ?? '4175';
const contentTypes = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

if (!/^\d+$/.test(portValue)) {
  throw new Error(`LIGHTHOUSE_TEST_PORT must be an integer, received: ${portValue}`);
}

const port = Number.parseInt(portValue, 10);
if (port < 1024 || port > 65_535) {
  throw new Error(`LIGHTHOUSE_TEST_PORT must be between 1024 and 65535, received: ${port}`);
}

if (!existsSync(chromePath)) {
  throw new Error(`Playwright Chromium is not installed at ${chromePath}. Run: pnpm exec playwright install chromium`);
}

const config = JSON.parse(await readFile(configPath, 'utf8'));

// The empty Writing index is intentionally noindexed (#396). Lighthouse's SEO
// category penalizes noindex pages, so skip SEO for that route only while the
// built output actually carries the noindex directive. When a post is
// published, the page becomes indexable again and SEO assertions resume.
const blogIndexPath = path.join(root, 'dist', 'blog', 'index.html');
if (existsSync(blogIndexPath)) {
  const blogHtml = await readFile(blogIndexPath, 'utf8');
  if (blogHtml.includes('noindex') && !config.routeOverrides['/blog/']) {
    config.routeOverrides['/blog/'] = { skipCategories: ['seo'] };
    console.log('Skipping SEO category for /blog/ — empty Writing index is intentionally noindexed.');
  }
}

const baseURL = `http://127.0.0.1:${port}`;

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

function routeName(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-');
}

async function assertPortAvailable() {
  await new Promise((resolve, reject) => {
    const probe = createNetServer();
    probe.once('error', () => reject(new Error(`${baseURL} is already in use. Choose another LIGHTHOUSE_TEST_PORT.`)));
    probe.listen(port, '127.0.0.1', () => probe.close(resolve));
  });
}

function serveStaticBuild(request, response) {
  void (async () => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', baseURL).pathname);
    } catch {
      response.writeHead(400).end('invalid path');
      return;
    }

    if (pathname.endsWith('/')) pathname += 'index.html';
    else if (!extname(pathname)) pathname += '/index.html';

    const filePath = resolve(distRoot, `.${pathname}`);
    if (filePath !== distRoot && !filePath.startsWith(`${distRoot}${sep}`)) {
      response.writeHead(403).end('forbidden');
      return;
    }

    let body;
    try {
      body = await readFile(filePath);
    } catch {
      response.writeHead(404).end('not found');
      return;
    }

    const extension = extname(filePath).toLowerCase();
    const contentType = contentTypes[extension] ?? 'application/octet-stream';
    const compressible =
      contentType.startsWith('text/') ||
      contentType.includes('javascript') ||
      contentType.includes('json') ||
      contentType.includes('xml') ||
      extension === '.svg';
    const acceptedEncodings = request.headers['accept-encoding'] ?? '';
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    };

    if (compressible && /(?:^|,)\s*br(?:\s*;[^,]*)?(?:,|$)/i.test(acceptedEncodings)) {
      body = brotliCompressSync(body, {
        params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 4 },
      });
      headers['Content-Encoding'] = 'br';
      headers.Vary = 'Accept-Encoding';
    } else if (compressible && /(?:^|,)\s*gzip(?:\s*;[^,]*)?(?:,|$)/i.test(acceptedEncodings)) {
      body = gzipSync(body, { level: 6 });
      headers['Content-Encoding'] = 'gzip';
      headers.Vary = 'Accept-Encoding';
    }

    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  })().catch((error) => {
    console.error('Lighthouse static server failed:', error);
    if (!response.headersSent) response.writeHead(500);
    response.end('internal server error');
  });
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // The static server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${baseURL}`);
}

async function verifyServer() {
  const expected = await readFile(distIndexPath);
  const response = await new Promise((resolve, reject) => {
    const request = httpGet(new URL('/', baseURL), { headers: { 'Accept-Encoding': 'br, gzip' } }, (result) => {
      const chunks = [];
      result.on('data', (chunk) => chunks.push(chunk));
      result.on('end', () =>
        resolve({ statusCode: result.statusCode, headers: result.headers, body: Buffer.concat(chunks) }),
      );
    });
    request.once('error', reject);
  });
  const encoding = response.headers['content-encoding'];
  const served =
    encoding === 'br'
      ? brotliDecompressSync(response.body)
      : encoding === 'gzip'
        ? gunzipSync(response.body)
        : response.body;
  if (response.statusCode !== 200 || digest(served) !== digest(expected)) {
    throw new Error(`Lighthouse harness is not serving this worktree's freshly built dist/index.html.`);
  }
  if (encoding !== 'br') {
    throw new Error('Lighthouse harness must serve compressible text with Brotli, as production does.');
  }
  const html = served.toString('utf8');
  if (html.includes('/@vite/client') || html.includes('astro-dev-toolbar')) {
    throw new Error('Lighthouse harness detected Astro/Vite development tooling.');
  }
}

await assertPortAvailable();
await rm(reportPath, { recursive: true, force: true });
await mkdir(reportPath, { recursive: true });

const server = createHttpServer(serveStaticBuild);

let chrome;
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  await waitForServer();
  await verifyServer();
  chrome = await launch({
    chromePath,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  const warnings = [];
  const manifest = [];

  for (const route of config.routes) {
    const url = new URL(route, baseURL).href;
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!runnerResult) throw new Error(`Lighthouse did not return a result for ${route}`);

    const reports = Array.isArray(runnerResult.report) ? runnerResult.report : [runnerResult.report];
    const name = routeName(route);
    await writeFile(path.join(reportPath, `${name}.report.html`), reports[0]);
    await writeFile(path.join(reportPath, `${name}.report.json`), reports[1] ?? JSON.stringify(runnerResult.lhr));

    const thresholdResult = inspectLighthouseThresholds(config, route, runnerResult.lhr);
    failures.push(...thresholdResult.failures);
    warnings.push(...thresholdResult.warnings);
    const categories = Object.fromEntries(
      Object.entries(runnerResult.lhr.categories).map(([id, category]) => [id, category.score]),
    );
    manifest.push({ route, finalUrl: runnerResult.lhr.finalDisplayedUrl, categories });
    console.log(
      `${route} ${Object.entries(categories)
        .map(([id, score]) => `${id}=${score}`)
        .join(' ')}`,
    );
  }

  await writeFile(path.join(reportPath, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  for (const warning of warnings) console.warn(`WARNING: ${warning}`);
  if (failures.length > 0) throw new Error(`Lighthouse thresholds failed:\n${failures.join('\n')}`);
  console.log(`All Lighthouse assertions passed. Reports: ${path.relative(root, reportPath)}`);
} finally {
  chrome?.kill();
  if (server.listening) server.close();
}
