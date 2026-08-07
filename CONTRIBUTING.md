# Contributing to website

Thanks for contributing! This guide is for humans after reading the [README](./README.md). AI assistants: see [AGENTS.md](./AGENTS.md) and `docs/`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Bootstrap](#bootstrap)
- [Scripts & Tooling](#scripts--tooling)
- [Architecture & Feature Modules](#architecture--feature-modules)
- [Coding Standards](#coding-standards)
- [Trunk Based Development](#trunk-based-development)
- [Commit Convention](#commit-convention)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [Documentation](#documentation)
- [PR Checklist](#pr-checklist)

## Prerequisites

- Node **22.22.0** (`fnm use` reads `.node-version`, or `nvm use`, `asdf`)
- **pnpm 10+** (`corepack enable && corepack prepare pnpm@10.28.1 --activate` or `npm i -g pnpm`)
- No Docker required (static site)

## Bootstrap

```sh
fnm use
pnpm install
pnpm dev          # http://localhost:4321
# visit / and /blog
```

Tooling is pre-configured: Husky pre-commit/pre-push, lint-staged, commitlint, cspell, MegaLinter.

## Scripts & Tooling

| Script                                                 | Purpose                     |
| ------------------------------------------------------ | --------------------------- |
| `pnpm dev`                                             | Astro dev server (HMR)      |
| `pnpm build`                                           | Static build to `dist/`     |
| `pnpm preview`                                         | Serve built site            |
| `pnpm lint` / `pnpm lint:fix`                          | ESLint (astro, ts, import)  |
| `pnpm format` / `pnpm format:check`                    | Prettier (astro plugin)     |
| `pnpm type-check`                                      | `astro check` (ts + .astro) |
| `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` | Vitest                      |
| `pnpm cspell`                                          | Spell check                 |
| `pnpm knip`                                            | Unused code detection       |

All scripts run in CI — `main` must stay green.

## Architecture & Feature Modules

Read [`docs/PROJECT_STRUCTURE.md`](./docs/PROJECT_STRUCTURE.md) first. Key points:

- **Pages** (`src/pages/`) are thin routers — delegate to **features** (`src/features/<domain>`).
- **Features** encapsulate `components/`, `services/`, `types/`, `hooks/` and export via `index.ts`.
- **Shared** (`src/shared/`) holds cross-feature utilities (`lib/utils.ts`) and UI.
- **Content** (`src/content/`) is build-time: define Zod schemas in `src/content.config.ts`, query via `getCollection` in services/pages.
- Start new features from `src/features/_feature-template_` (see its README).

```
src/features/_feature-template_/
├── components/  # Astro / island components
├── services/    # data fetching
├── types/       # domain types
├── hooks/       # client hooks
└── index.ts     # public API
```

Usage:

```bash
cp -r src/features/_feature-template_ src/features/my-feature
# implement, export via index.ts, import as:
import { MyComponent } from '@/features/my-feature';
```

## Coding Standards

- **TypeScript strict** (see `tsconfig.json`, `eslint.config.mjs`) — no `any` without justification.
- **Content-first** — static HTML + collections over client state. Add framework islands (`npx astro add react`) only when needed, with `client:*` directives.
- **Accessibility** — semantic HTML, alt text, heading order, keyboard support.
- **Styling** — scoped `<style>` in `.astro` or global CSS in `src/styles/`. Tailwind optional (add `@astrojs/tailwind` if team prefers).
- **Imports** — use alias `@/` → `src/`; `import/order` enforces grouping (external → internal → alias).
- **Docs** — update `docs/` when changing architecture, APIs, or patterns; don't duplicate docs in README/CONTRIBUTING.

## Trunk Based Development

Single trunk `main` (always deployable). Short-lived branches:

| Branch  | Pattern        | Lifetime  |
| ------- | -------------- | --------- |
| Main    | `main`         | Permanent |
| Feature | `feat/<slug>`  | <2 days   |
| Fix     | `fix/<slug>`   | <1 day    |
| Chore   | `chore/<slug>` | <1 day    |

Workflow:

1. Pull latest `main`: `git pull origin main`
2. Branch: `git checkout -b feat/my-feature`
3. Small commits, push early, open draft PR
4. CI must pass (build, lint, type-check, tests)
5. Merge (squash or rebase), delete branch

## Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/) enforced by **commitlint** (Husky `commit-msg` hook).

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `chore`, `ci`, `revert`

Examples:

```sh
feat(blog): add reading time to post cards
fix(a11y): add alt text to hero image
docs(structure): update feature template guide
```

## Dependencies

- Justify new runtime dependencies in PR description.
- Prefer Astro integrations (`npx astro add tailwind`) and built-ins over extra libraries.
- Run `pnpm install` and commit `pnpm-lock.yaml` (never `package-lock.json`).

## Testing

- **Vitest** (`vitest.config.ts`, `jsdom`, `vitest.setup.ts`) — unit tests for services/utils.
- Place tests next to feature code: `services/foo.test.ts`, `shared/lib/utils.test.ts`.
- Run:

```sh
pnpm test            # run
pnpm test:watch      # watch
pnpm test:coverage   # coverage (thresholds: lines 25%, branches 30%)
```

Coverage is uploaded to Codecov via CI (optional token). Add tests for business logic; snapshot/profile critical UI manually.

## Documentation

- `docs/` is source of truth. Update relevant file when changing architecture, components, config, or GitHub setup.
- Docs index: [`docs/README.md`](./docs/README.md).

## PR Checklist

- [ ] `pnpm lint` and `pnpm type-check` pass
- [ ] `pnpm test` passes (or reason documented)
- [ ] `pnpm build` succeeds
- [ ] `pnpm format:check` passes (or run `pnpm format`)
- [ ] Branch up-to-date with `main`
- [ ] PR is small and focused (<400 lines ideal)
- [ ] No secrets or `.env` committed
- [ ] Docs updated if needed (architecture, APIs, patterns)
- [ ] Commit messages follow Conventional Commits

Happy building!
