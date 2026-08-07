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

```
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

## Future: E2E

When personal site needs E2E (forms, islands), add Playwright:

```sh
pnpm add -D @playwright/test
npx playwright init
# add .github/workflows/e2e.yml similar to tests.yml
```

Document E2E in this file when added.
