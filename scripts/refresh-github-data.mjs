#!/usr/bin/env node
/**
 * Build-time GitHub evidence refresh.
 *
 * - Reads committed cache + editorial seed subjects
 * - Optionally verifies public repos with GITHUB_TOKEN (never shipped to browser)
 * - On API failure: keep cache, omit volatile metrics, exit 0
 * - Exit 1 only when cache is missing/corrupt (critical)
 *
 * Usage: pnpm data:refresh
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const cachePath = resolve(root, 'src/data/generated/github-evidence.json');

const GITHUB_API = 'https://api.github.com';
const USER_AGENT = 'digital-nest-data-refresh/1.0 (+https://www.ulises-jeremias.dev)';

/** Subjects the pipeline knows how to re-verify. Do not invent new evidence here. */
const VERIFY_REPOS = [
  { id: 'rxv-owned', repo: 'ulises-jeremias/rxv' },
  { id: 'agent-toolkit-owned', repo: 'ulises-jeremias/agent-toolkit' },
  { id: 'agentic-workstation-owned', repo: 'ulises-jeremias/agentic-workstation' },
  { id: 'agentic-harness-owned', repo: 'ulises-jeremias/agentic-harness' },
  { id: 'setup-v-maintained', repo: 'vlang/setup-v' },
  { id: 'vtl-maintained', repo: 'vlang/vtl' },
  { id: 'vsl-maintained', repo: 'vlang/vsl' },
];

function loadCache() {
  if (!existsSync(cachePath)) {
    console.error(`[data:refresh] CRITICAL: missing cache at ${cachePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(cachePath, 'utf8'));
  } catch (err) {
    console.error(`[data:refresh] CRITICAL: corrupt cache — ${err.message}`);
    process.exit(1);
  }
}

async function fetchRepo(repo, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}/repos/${repo}`, { headers });
  if (res.status === 404) return { ok: false, reason: 'not_found' };
  if (!res.ok) return { ok: false, reason: `http_${res.status}` };
  const data = await res.json();
  return {
    ok: true,
    full_name: data.full_name,
    private: Boolean(data.private),
    // stars available but intentionally not written unless we promote to metrics with verifiedAt
    stargazers_count: typeof data.stargazers_count === 'number' ? data.stargazers_count : undefined,
  };
}

async function main() {
  const cache = loadCache();
  if (cache.schemaVersion !== 1 || !Array.isArray(cache.evidence)) {
    console.error('[data:refresh] CRITICAL: cache schema invalid');
    process.exit(1);
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const notes = [...(cache.notes || [])].filter((n) => !n.startsWith('[refresh'));
  let mode = 'offline-cache';
  let apiFailed = false;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    notes.push('[refresh] No GITHUB_TOKEN — reusing committed evidence; volatile omitted.');
    console.warn('[data:refresh] No GITHUB_TOKEN set. Keeping cache; omitting volatile metrics.');
  } else {
    mode = 'refresh';
    const verified = [];
    for (const row of VERIFY_REPOS) {
      try {
        const result = await fetchRepo(row.repo, token);
        if (!result.ok) {
          apiFailed = true;
          notes.push(`[refresh] verify failed for ${row.repo}: ${result.reason}`);
          console.warn(`[data:refresh] verify failed for ${row.repo}: ${result.reason}`);
          continue;
        }
        if (result.private) {
          notes.push(`[refresh] skipped private ${row.repo}`);
          continue;
        }
        verified.push(row.id);
        const item = cache.evidence.find((e) => e.id === row.id);
        if (item) {
          item.verifiedAt = today;
          item.provenance = 'GENERATED_GITHUB_SOURCE';
        }
      } catch (err) {
        apiFailed = true;
        notes.push(`[refresh] network error for ${row.repo}: ${err.message}`);
        console.warn(`[data:refresh] network error for ${row.repo}: ${err.message}`);
      }
    }
    notes.push(`[refresh] verified ${verified.length}/${VERIFY_REPOS.length} public repos on ${today}`);
  }

  // Graceful: never invent volatile dashboard metrics; omit on any failure / no token.
  const volatile = {};
  if (apiFailed) {
    notes.push('[refresh] volatile metrics omitted due to partial API failure');
    mode = existsSync(cachePath) ? 'offline-cache' : mode;
  }

  const next = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    generator: 'scripts/refresh-github-data.mjs',
    mode,
    evidence: cache.evidence,
    volatile,
    notes,
  };

  writeFileSync(cachePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  console.log(`[data:refresh] Wrote ${cachePath} (mode=${mode}, evidence=${next.evidence.length})`);
  process.exit(0);
}

main().catch((err) => {
  // Non-critical path: keep prior cache on unexpected errors if it exists.
  if (existsSync(cachePath)) {
    console.warn(`[data:refresh] Unexpected error — keeping cache. ${err.message}`);
    process.exit(0);
  }
  console.error(`[data:refresh] CRITICAL: ${err.message}`);
  process.exit(1);
});
