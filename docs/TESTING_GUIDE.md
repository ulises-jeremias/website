# Testing Guide — website

Vitest is configured for **unit tests of services and utils** (islands and Astro components are checked via `astro check` + manual QA). Mirrors `nextjs-saas-ai-template` Jest setup but uses Vitest (Vite-native).

## Config

- `vitest.config.ts` — `environment: jsdom`, `globals: true`, alias `@` → `src`, coverage `v8`
- `vitest.setup.ts` — `import '@testing-library/jest-dom/vitest'`
- `tsconfig.json` — `@/*` alias, `noImplicitAny: false` for Astro frontmatter
- Thresholds: `lines 25%`, `branches 30%`, `functions 30%`, `statements 25%` (increase as coverage grows)

## Running

```sh
pnpm test            # run once
pnpm test:watch      # watch mode
pnpm test:coverage   # with coverage → ./coverage/lcov.info
pnpm test -- path/to/file.test.ts
```

CI (`tests.yml`) runs `pnpm test:coverage` and uploads to Codecov.

## Writing tests

Place next to feature code:

```text
src/features/_feature-template_/services/exampleService.test.ts
src/shared/lib/utils.test.ts
src/features/blog/services/blog.test.ts  # when blog logic grows
```

Example:

```ts
import { describe, expect, it } from 'vitest';
import { getExampleById } from '@/features/_feature-template_/services/exampleService';

describe('exampleService', () => {
  it('returns example by id', () => {
    expect(getExampleById('static-html')?.title).toBe('Static HTML output');
  });
});
```

Guidelines:

- Test **services** and **utils** thoroughly; they hold business logic.
- For **Astro components**, prefer `astro check` + visual QA of `/` and `/blog` over brittle snapshots.
- When you add React islands (`npx astro add react`), test island components with `@testing-library/react` + `vitest` (already includes `jest-dom`).
- Mock `astro:content` with manual mocks if needed; otherwise test services via pure functions.
- Keep tests deterministic — avoid network, use seeded data.

## Coverage

- Coverage excludes `**/*.astro`, `**/*.d.ts`, `**/__mocks__/**`, `*.test.*`
- Thresholds live in `vitest.config.ts` (`coverage.thresholds`). Raise them as you add tests — never lower without justification in PR.
- Codecov config in `codecov.yml` targets 80% (project/patch) but CI `fail_ci_if_error: false` so missing token doesn't fail PRs.

## Adding tests for new features

1. Create `src/features/<name>/services/<name>.test.ts`
2. Import from `@/features/<name>` public API (`index.ts`), not internals.
3. Run `pnpm test:coverage` and ensure thresholds pass.
4. Update this doc if you add integration or E2E tests (Playwright).

## Browser and visual tests

Visual and shell smoke coverage lives under `tests/visual/` and runs with Playwright:

```sh
pnpm test:visual:update   # build static output, own the server, and write baselines
pnpm test:visual          # build static output, own the server, and compare baselines
pnpm test:visual:harness  # verify the isolated production-server contract
```

Config: `playwright.config.ts` uses Chromium for maintained visual goldens and
Firefox/WebKit for route smoke coverage. The `mobile-chrome` and `mobile-safari`
projects use Playwright's Pixel 7 and iPhone 15 device profiles for mobile
emulation and run `mobile-device-smoke.spec.ts`; they do not replace physical
device testing. The suite owns a static `dist/` server on `127.0.0.1:4173` and
never reuses an existing server. If the port is occupied, the run fails instead
of attaching to an ambiguous app or worktree. Set `VISUAL_TEST_PORT` to an unused
port when running visual suites from multiple worktrees concurrently.

Normal browser runs write current desktop and mobile review captures under
`test-results/uiux-review/`. CI uploads this ignored directory for human review.
Only `test:visual:update` may change maintained goldens, and only after the
product owner approves the review package.

Do not start `astro dev` or `astro preview` for these commands. The harness builds
the current worktree, verifies that the served root document matches that build,
and rejects Astro/Vite development-toolbar artifacts before tests begin.

Install the pinned browser binaries before a local run:

```sh
pnpm exec playwright install chromium firefox webkit
```

Linux CI uses `--with-deps` so WebKit receives its host libraries. A browser that
cannot launch is an untested environment, not a passing result.

## Route performance budgets

Route budgets measure a fresh browser context at 390x844 and 1440x1000. Text
resources use deterministic gzip size; images and fonts use their already
compressed source bytes.

```sh
pnpm performance:check      # build and enforce config/route-budgets.json
pnpm performance:baseline   # intentionally refresh the reviewed baseline
pnpm lighthouse:ci          # mobile lab audit for all audited routes
```

The accepted measurement artifact lives at
`docs/design/current/performance-baseline.json`. Do not refresh it merely to make
CI green; investigate the changed route and adjust a limit only with evidence.
Lighthouse reports are written to `.lighthouse/reports` and uploaded by the
browser-quality workflow. Accessibility and best-practices scores are required
on every audited route; SEO is required for indexable routes and is explicitly
skipped for the intentionally `noindex` `/404.html` route. Performance and Web
Vitals thresholds are warning-level lab signals because field Core Web Vitals
are not available for this static pre-release.
