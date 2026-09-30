#!/usr/bin/env node
/**
 * Refresh the sponsor-facing metrics snapshot (ADR-004).
 *
 *   pnpm data:sponsor:refresh            # fetch and rewrite the snapshot
 *   pnpm data:sponsor:refresh --check    # validate the committed snapshot only (no network)
 *   node scripts/refresh-sponsor-metrics.mjs --strict   # exit 1 if any source fails
 *
 * Output: src/data/generated/sponsor-metrics.json — committed, reviewed, and
 * read at build time. Production builds never call these APIs.
 *
 * Metric selection is deliberate. Only metrics that survived the 2026-09-30
 * credibility review are fetched:
 * - create-awesome-node-app npm downloads, trailing 12 months (mature package;
 *   release-day and CI spikes are a small share of a year)
 * - create-awesome-python-app PyPI downloads, trailing 30 days, mirrors excluded
 * - external contributor counts (default-branch authors minus the owner and bots;
 *   Create Awesome families count the union of their CLI and *-templates repos,
 *   since contributors often land only in templates)
 *
 * Agent Toolkit package downloads are intentionally NOT collected yet: the
 * packages are weeks old and most downloads fall on release days or come from
 * the project's own CI. Revisit after roughly a quarter of history.
 *
 * Failure behavior: every metric is fetched independently and stamped with its
 * own `retrievedAt`. If a source fails, the committed value for that metric is
 * kept (last-known-good, with its original `retrievedAt`) and the script exits
 * 0 — unless `--strict` is passed. Metrics whose collector no longer exists are
 * dropped, never carried forward. It exits 1 when the committed snapshot is
 * missing or invalid, or when it would write an invalid snapshot.
 */
import { realpathSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const SNAPSHOT_PATH = path.join(ROOT, 'src', 'data', 'generated', 'sponsor-metrics.json');
const GENERATOR = 'scripts/refresh-sponsor-metrics.mjs';
const OWNER = 'ulises-jeremias';
const CHECK_ONLY = process.argv.includes('--check');
const STRICT = process.argv.includes('--strict');
const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';

const BOT_PATTERN = /\[bot\]$|^dependabot|^renovate|^imgbot|^github-actions|^allcontributors/i;
const PEOPLE_PATTERN = /\busers?\b|\binstalls?\b|\bpeople\b/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);

/**
 * Mirrors `sponsorMetricsSnapshotSchema` in src/data/sponsorship.ts so the
 * script can never write a snapshot the build would reject.
 */
export function validateSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') return ['snapshot is not an object'];
  if (!/^\d{4}-\d{2}-\d{2}T/.test(snapshot.generatedAt ?? '')) errors.push('generatedAt must be an ISO timestamp');
  if (typeof snapshot.generator !== 'string' || snapshot.generator.length === 0) errors.push('generator is required');
  if (!Array.isArray(snapshot.metrics)) return [...errors, 'metrics must be an array'];
  const ids = new Set();
  for (const metric of snapshot.metrics) {
    const id = metric?.id ?? '?';
    if (typeof metric?.id !== 'string' || metric.id.length === 0) errors.push('metric id is required');
    if (ids.has(id)) errors.push(`${id}: duplicate id`);
    ids.add(id);
    for (const key of ['project', 'label', 'unit']) {
      if (typeof metric[key] !== 'string' || metric[key].length === 0) errors.push(`${id}: ${key} is required`);
    }
    if (!Number.isInteger(metric.value) || metric.value < 0) errors.push(`${id}: value must be a non-negative integer`);
    if (PEOPLE_PATTERN.test(metric.unit ?? '') || PEOPLE_PATTERN.test(metric.label ?? '')) {
      errors.push(`${id}: unit/label must not imply people or installs`);
    }
    const { start, end } = metric.period ?? {};
    if (!ISO_DATE.test(start ?? '') || !ISO_DATE.test(end ?? ''))
      errors.push(`${id}: period needs ISO start/end dates`);
    else if (start > end) errors.push(`${id}: period start is after end`);
    if (!ISO_DATE.test(metric.retrievedAt ?? '')) errors.push(`${id}: retrievedAt must be an ISO date`);
    if (typeof metric.source?.name !== 'string' || !/^https:\/\//.test(metric.source?.url ?? '')) {
      errors.push(`${id}: source needs a name and an https URL`);
    }
    if (typeof metric.caveat !== 'string' || metric.caveat.length < 20)
      errors.push(`${id}: caveat must be at least 20 characters`);
  }
  return errors;
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, { headers: { 'user-agent': 'ulises-jeremias-website-metrics', ...headers } });
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return response.json();
}

function githubHeaders() {
  return {
    accept: 'application/vnd.github+json',
    ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
  };
}

async function npmYear(pkg) {
  const data = await getJson(`https://api.npmjs.org/downloads/range/last-year/${encodeURIComponent(pkg)}`);
  const value = data.downloads.reduce((sum, day) => sum + day.downloads, 0);
  return {
    project: 'Create Awesome Node App',
    label: 'npm downloads, trailing 12 months',
    value,
    unit: 'package downloads',
    period: { start: data.start, end: data.end },
    source: { name: 'npm downloads API', url: `https://api.npmjs.org/downloads/range/last-year/${pkg}` },
    caveat:
      'Counts every download, including CI pipelines, mirrors, and the project’s own smoke tests. Downloads are not users.',
  };
}

async function pypiMonth(pkg) {
  const data = await getJson(`https://pypistats.org/api/packages/${encodeURIComponent(pkg)}/overall?mirrors=false`);
  const rows = data.data
    .filter((row) => row.category === 'without_mirrors')
    .sort((a, b) => a.date.localeCompare(b.date));
  const last30 = rows.slice(-30);
  if (last30.length === 0) throw new Error(`pypistats returned no rows for ${pkg}`);
  return {
    project: 'Create Awesome Python App',
    label: 'PyPI downloads, trailing 30 days (mirrors excluded)',
    value: last30.reduce((sum, row) => sum + row.downloads, 0),
    unit: 'package downloads',
    period: { start: last30[0].date, end: last30.at(-1).date },
    source: { name: 'PyPI Stats', url: `https://pypistats.org/packages/${pkg}` },
    caveat: 'Includes CI and automated installs; about half fall on release days. Downloads are not users.',
  };
}

/** Logins that count as external contributors, after owner/bot exclusion. Pure for testing. */
export function externalLogins(contributors) {
  const people = new Set();
  for (const person of contributors) {
    if (person?.type !== 'User' || BOT_PATTERN.test(person.login ?? '') || person.login === OWNER) continue;
    people.add(person.login);
  }
  return people;
}

async function repoContributorLogins(owner, repo) {
  const people = new Set();
  for (let page = 1; page <= 10; page += 1) {
    const batch = await getJson(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100&page=${page}`,
      githubHeaders(),
    );
    for (const login of externalLogins(batch)) people.add(login);
    if (batch.length < 100) break;
  }
  return people;
}

async function repoCreatedOn(owner, repo) {
  const info = await getJson(`https://api.github.com/repos/${owner}/${repo}`, githubHeaders());
  return info.created_at.slice(0, 10);
}

async function externalContributors(owner, repo, project) {
  const people = await repoContributorLogins(owner, repo);
  return {
    project,
    label: 'Contributors besides the author',
    value: people.size,
    unit: 'contributors with commits on the default branch',
    period: { start: await repoCreatedOn(owner, repo), end: today() },
    source: { name: 'GitHub contributors API', url: `https://github.com/${owner}/${repo}/graphs/contributors` },
    caveat:
      'Counts accounts that authored at least one commit on the default branch, excluding the author and bots. Size of contribution varies.',
  };
}

/**
 * Union of external contributors across the CLI and templates repos of one
 * Create Awesome family. Contributors often land only in *-templates, so a
 * single-repo count under-reports the project.
 */
async function familyContributors(owner, repos, project) {
  const people = new Set();
  const created = [];
  for (const repo of repos) {
    for (const login of await repoContributorLogins(owner, repo)) people.add(login);
    created.push(await repoCreatedOn(owner, repo));
  }
  const [primary, ...rest] = repos;
  const restGraphs = rest.map((repo) => `https://github.com/${owner}/${repo}/graphs/contributors`).join(', ');
  return {
    project,
    label: 'Contributors besides the author',
    value: people.size,
    unit: 'contributors with commits on either default branch',
    period: { start: created.sort()[0], end: today() },
    source: {
      name: 'GitHub contributors API',
      url: `https://github.com/${owner}/${primary}/graphs/contributors`,
    },
    caveat:
      `Union across ${repos.map((repo) => `${owner}/${repo}`).join(' and ')} ` +
      `(also: ${restGraphs}). Counts accounts that authored at least one commit on the default branch of ` +
      'either repo, excluding the author and bots. Size of contribution varies.',
  };
}

/** The only metrics the snapshot may contain. Ids are stable across runs. */
const COLLECTORS = [
  { id: 'npm-create-awesome-node-app-12m', collect: () => npmYear('create-awesome-node-app') },
  { id: 'pypi-create-awesome-python-app-30d', collect: () => pypiMonth('create-awesome-python-app') },
  {
    id: 'contributors-ulises-jeremias-dotfiles',
    collect: () => externalContributors('ulises-jeremias', 'dotfiles', 'HorneroConfig'),
  },
  {
    id: 'contributors-create-node-app-cli-and-templates',
    collect: () =>
      familyContributors('Create-Node-App', ['create-node-app', 'cna-templates'], 'Create Awesome Node App'),
  },
];

async function main() {
  let committed;
  try {
    committed = JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'));
  } catch (error) {
    console.error(`[sponsor-metrics] cannot read committed snapshot: ${error.message}`);
    process.exit(1);
  }
  const committedErrors = validateSnapshot(committed);
  if (committedErrors.length > 0) {
    console.error(`[sponsor-metrics] committed snapshot is invalid:\n- ${committedErrors.join('\n- ')}`);
    process.exit(1);
  }
  if (CHECK_ONLY) {
    console.log(`[sponsor-metrics] snapshot valid · ${committed.metrics.length} metrics · ${committed.generatedAt}`);
    return;
  }

  const previous = new Map(committed.metrics.map((metric) => [metric.id, metric]));
  const metrics = [];
  const failures = [];
  for (const { id, collect } of COLLECTORS) {
    try {
      const metric = { id, ...(await collect()), retrievedAt: today() };
      metrics.push(metric);
      console.log(`[sponsor-metrics] ${id}: ${metric.value} (${metric.period.start} → ${metric.period.end})`);
    } catch (error) {
      failures.push(id);
      const lastKnownGood = previous.get(id);
      if (lastKnownGood) metrics.push(lastKnownGood);
      console.warn(
        `[sponsor-metrics] ${id} failed (${error.message}); ${lastKnownGood ? 'kept last-known-good' : 'omitted'}`,
      );
    }
  }
  metrics.sort((a, b) => a.id.localeCompare(b.id));

  if (failures.length === COLLECTORS.length) {
    console.warn('[sponsor-metrics] no source succeeded; snapshot left unchanged');
    process.exit(STRICT ? 1 : 0);
  }
  const next = { generatedAt: new Date().toISOString(), generator: GENERATOR, metrics };
  const errors = validateSnapshot(next);
  if (errors.length > 0) {
    console.error(`[sponsor-metrics] refusing to write invalid snapshot:\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  await writeFile(SNAPSHOT_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`[sponsor-metrics] wrote ${metrics.length} metrics (${COLLECTORS.length - failures.length} refreshed)`);
  if (STRICT && failures.length > 0) process.exit(1);
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
if (invokedDirectly) {
  await main();
}
