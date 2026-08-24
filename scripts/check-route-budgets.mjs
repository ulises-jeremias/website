import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { gzipSync } from 'node:zlib';

const ROUTES = [
  '/',
  '/dotfiles/',
  '/agentic-workstation/',
  '/agent-toolkit/',
  '/agentic-harness/',
  '/v/',
  '/create-awesome/',
  '/community/',
  '/blog/',
  '/projects/',
  '/open-source/',
  '/404.html',
];

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 1000 },
};

const ROOT = process.cwd();
const BUDGET_PATH = path.join(ROOT, 'config', 'route-budgets.json');
const BASELINE_PATH = path.join(ROOT, 'docs', 'design', 'current', 'performance-baseline.json');
const portValue = process.env.PERFORMANCE_TEST_PORT ?? '4174';

if (!/^\d+$/.test(portValue)) {
  throw new Error(`PERFORMANCE_TEST_PORT must be an integer, received: ${portValue}`);
}

const port = Number.parseInt(portValue, 10);
if (port < 1024 || port > 65_535) {
  throw new Error(`PERFORMANCE_TEST_PORT must be between 1024 and 65535, received: ${port}`);
}
const baseURL = `http://127.0.0.1:${port}`;
const writeBaseline = process.argv.includes('--write-baseline');

function resourceType(contentType, pathname) {
  if (contentType.includes('text/html')) return 'document';
  if (contentType.includes('javascript') || pathname.endsWith('.js')) return 'script';
  if (contentType.includes('text/css') || pathname.endsWith('.css')) return 'style';
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.includes('font') || /\.(?:woff2?|ttf|otf)$/.test(pathname)) return 'font';
  return 'other';
}

function compressedSize(body, contentType, pathname) {
  const compressible =
    contentType.startsWith('text/') ||
    contentType.includes('javascript') ||
    contentType.includes('json') ||
    contentType.includes('xml') ||
    pathname.endsWith('.svg');

  return compressible ? gzipSync(body, { level: 9 }).byteLength : body.byteLength;
}

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function assertPortAvailable() {
  await new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', () => reject(new Error(`${baseURL} is already in use. Choose another PERFORMANCE_TEST_PORT.`)));
    probe.listen(port, '127.0.0.1', () => probe.close(resolve));
  });
}

async function waitForServer(server, stderr) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Performance server exited with code ${server.exitCode}.\n${stderr.join('')}`);
    }
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for ${baseURL}`);
}

async function verifyServer() {
  const expected = await readFile(path.join(ROOT, 'dist', 'index.html'));
  const response = await fetch(new URL('/', baseURL));
  const served = Buffer.from(await response.arrayBuffer());
  if (!response.ok || digest(served) !== digest(expected)) {
    throw new Error(`Performance harness is not serving this worktree's freshly built dist/index.html.`);
  }
  const html = served.toString('utf8');
  if (html.includes('/@vite/client') || html.includes('astro-dev-toolbar')) {
    throw new Error('Performance harness detected Astro/Vite development tooling.');
  }
}

async function measureRoute(browser, route, viewport) {
  const context = await browser.newContext({
    colorScheme: 'dark',
    deviceScaleFactor: 1,
    viewport,
  });
  const page = await context.newPage();
  const responses = [];

  page.on('response', (response) => {
    if (new URL(response.url()).origin !== baseURL) return;
    responses.push(
      (async () => {
        const body = await response.body().catch(() => null);
        if (!body) return null;
        const url = new URL(response.url());
        const contentType = response.headers()['content-type'] ?? '';
        return {
          path: url.pathname,
          type: resourceType(contentType, url.pathname),
          bytes: compressedSize(body, contentType, url.pathname),
        };
      })(),
    );
  });

  await page.goto(new URL(route, baseURL).toString(), { waitUntil: 'networkidle' });
  const resources = (await Promise.all(responses)).filter(Boolean);
  await context.close();

  const uniqueResources = [...new Map(resources.map((resource) => [resource.path, resource])).values()];
  const totals = {
    total: 0,
    document: 0,
    script: 0,
    style: 0,
    image: 0,
    font: 0,
    other: 0,
  };

  for (const resource of uniqueResources) {
    totals[resource.type] += resource.bytes;
    totals.total += resource.bytes;
  }

  return { ...totals, requests: uniqueResources.length };
}

function compareBudgets(report, budgets) {
  const failures = [];

  for (const [route, viewports] of Object.entries(report.routes)) {
    for (const [viewport, metrics] of Object.entries(viewports)) {
      const limits = budgets.routes?.[route]?.[viewport];
      if (!limits) {
        failures.push(`${route} ${viewport}: missing budget`);
        continue;
      }

      for (const [metric, maximum] of Object.entries(limits)) {
        if (metrics[metric] > maximum) {
          failures.push(`${route} ${viewport} ${metric}: ${metrics[metric]} > ${maximum} bytes`);
        }
      }
    }
  }

  return failures;
}

await assertPortAvailable();
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'dist'], {
  cwd: ROOT,
  stdio: ['ignore', 'ignore', 'pipe'],
});
const serverErrors = [];
server.stderr?.on('data', (chunk) => serverErrors.push(chunk.toString()));

let browser;

try {
  await waitForServer(server, serverErrors);
  await verifyServer();
  browser = await chromium.launch({ headless: true });

  const report = {
    generatedAt: new Date().toISOString(),
    method:
      'Fresh browser context per route and viewport; text resources gzip level 9; already-compressed assets use source bytes.',
    routes: {},
  };

  for (const route of ROUTES) {
    report.routes[route] = {};
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      report.routes[route][name] = await measureRoute(browser, route, viewport);
    }
  }

  if (writeBaseline) {
    await mkdir(path.dirname(BASELINE_PATH), { recursive: true });
    await writeFile(BASELINE_PATH, `${JSON.stringify(report, null, 2)}\n`);
    process.stdout.write(`Wrote ${path.relative(ROOT, BASELINE_PATH)}\n`);
  }

  process.stdout.write(`${JSON.stringify(report.routes, null, 2)}\n`);

  const budgets = JSON.parse(await readFile(BUDGET_PATH, 'utf8'));
  const failures = compareBudgets(report, budgets);
  if (failures.length > 0) {
    throw new Error(`Route budgets exceeded:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  }

  process.stdout.write('All route budgets passed.\n');
} finally {
  await browser?.close();
  if (server.exitCode === null) server.kill('SIGTERM');
}
