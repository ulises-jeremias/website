import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { inspectLighthouseThresholds } from './lighthouse-thresholds.mjs';

const root = process.cwd();
const chromePath = chromium.executablePath();
const configPath = path.join(root, 'config', 'lighthouse.json');
const reportPath = path.join(root, '.lighthouse', 'reports');
const distIndexPath = path.join(root, 'dist', 'index.html');
const portValue = process.env.LIGHTHOUSE_TEST_PORT ?? '4175';

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
    const probe = createServer();
    probe.once('error', () => reject(new Error(`${baseURL} is already in use. Choose another LIGHTHOUSE_TEST_PORT.`)));
    probe.listen(port, '127.0.0.1', () => probe.close(resolve));
  });
}

async function waitForServer(server, stderr) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Lighthouse server exited with code ${server.exitCode}.\n${stderr.join('')}`);
    }
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
  const response = await fetch(new URL('/', baseURL));
  const served = Buffer.from(await response.arrayBuffer());
  if (!response.ok || digest(served) !== digest(expected)) {
    throw new Error(`Lighthouse harness is not serving this worktree's freshly built dist/index.html.`);
  }
  const html = served.toString('utf8');
  if (html.includes('/@vite/client') || html.includes('astro-dev-toolbar')) {
    throw new Error('Lighthouse harness detected Astro/Vite development tooling.');
  }
}

await assertPortAvailable();
await rm(reportPath, { recursive: true, force: true });
await mkdir(reportPath, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'dist'], {
  cwd: root,
  stdio: ['ignore', 'ignore', 'pipe'],
});
const serverErrors = [];
server.stderr?.on('data', (chunk) => serverErrors.push(chunk.toString()));

let chrome;
try {
  await waitForServer(server, serverErrors);
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
  if (server.exitCode === null) server.kill('SIGTERM');
}
