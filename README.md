# website — Personal Website

[![Build](https://github.com/ulises-jeremias/website/actions/workflows/build.yml/badge.svg)](https://github.com/ulises-jeremias/website/actions/workflows/build.yml)
[![Lint](https://github.com/ulises-jeremias/website/actions/workflows/lint.yml/badge.svg)](https://github.com/ulises-jeremias/website/actions/workflows/lint.yml)
[![Typecheck](https://github.com/ulises-jeremias/website/actions/workflows/type-check.yml/badge.svg)](https://github.com/ulises-jeremias/website/actions/workflows/type-check.yml)
[![Tests](https://github.com/ulises-jeremias/website/actions/workflows/tests.yml/badge.svg)](https://github.com/ulises-jeremias/website/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/ulises-jeremias/website/branch/main/graph/badge.svg)](https://codecov.io/gh/ulises-jeremias/website)

Personal website — **Astro 7**, content-first, feature-based architecture. Migrated from [`create-awesome-node-app` Astro starter](https://github.com/Create-Node-App/cna-templates) and hardened with tooling from [`nextjs-saas-ai-template`](https://github.com/Create-Node-App/nextjs-saas-ai-template).

> **Stack:** Astro 7 · TypeScript (strict) · pnpm · ESLint + Prettier · Vitest · Husky + lint-staged · commitlint · cspell · MegaLinter · GitHub Actions

## Features

- **Astro 7** — static-first, file-based routing, content collections
- **Feature-based architecture** — `src/features/<domain>` with `_feature-template_` scaffold (inspired by nextjs-saas-ai-template)
- **Content collections** — blog under `src/content/blog` (`/blog`, `/blog/[slug]`)
- **Layouts & SEO** — `BaseLayout` + `BaseHead`
- **Tooling** — ESLint (astro + typescript + import + jsx-a11y), Prettier (astro), cspell, knip, MegaLinter
- **Quality gates** — Husky, lint-staged, commitlint (Conventional Commits), Vitest + coverage, Codecov
- **CI** — Build, Lint+Format, Type-check, Tests (all required on `main`)
- **pnpm** — `packageManager: pnpm@10.28.1`, `engines: node>=22`

## Quickstart

```sh
# Node 22 (via fnm/nvm/asdf)
fnm use        # reads .node-version (22.22.0)

# Install
pnpm install

# Dev
pnpm dev       # http://localhost:4321

# Other
pnpm build
pnpm preview
pnpm lint
pnpm format
pnpm type-check
pnpm test
pnpm test:coverage
```

Visit `/` and `/blog`.

## Project Structure

```
.
├── public/                 # static assets (favicon, logo)
├── src/
│   ├── content/            # Markdown/MDX collections
│   │   └── blog/
│   ├── content.config.ts   # Zod schemas + loaders
│   ├── features/           # Feature modules
│   │   ├── _feature-template_/
│   │   ├── blog/           # Blog domain (services, components, types)
│   │   └── landing/        # Landing page data + features
│   ├── shared/
│   │   ├── lib/            # utils (cn, formatDate, slugify)
│   │   └── components/     # cross-feature UI
│   ├── layouts/            # BaseLayout
│   ├── pages/              # File-based routes (thin, delegate to features)
│   └── styles/             # Global CSS
├── docs/                   # Documentation (source of truth)
├── .github/
│   ├── workflows/          # build, lint, type-check, tests, mega-linter, pr-review, todo
│   └── ISSUE_TEMPLATE/
├── .husky/                 # pre-commit (lint-staged), commit-msg (commitlint), pre-push (type-check)
├── cspell.json
├── commitlint.config.cjs
├── eslint.config.mjs
├── vitest.config.ts
└── astro.config.mjs
```

See [`docs/PROJECT_STRUCTURE.md`](./docs/PROJECT_STRUCTURE.md) for full conventions and [`docs/README.md`](./docs/README.md) for doc index.

### Feature-based development

Each feature is self-contained:

```
src/features/<name>/
├── components/  # Astro / island UI
├── services/    # data fetching, business logic
├── types/       # domain types
├── hooks/       # client hooks (if needed)
├── index.ts     # public API
└── README.md
```

Create a new feature:

```bash
cp -r src/features/_feature-template_ src/features/my-feature
# rename, implement, export via index.ts
```

Import only via public API: `import { X } from '@/features/my-feature'` — never deep-import internals.

## Scripts

| `pnpm <script>`                         | Description              |
| --------------------------------------- | ------------------------ |
| `dev`                                   | Astro dev server         |
| `build`                                 | Static build → `dist/`   |
| `preview`                               | Preview production build |
| `format` / `format:check`               | Prettier                 |
| `lint` / `lint:fix` / `lint:a11y`       | ESLint                   |
| `type-check`                            | `astro check`            |
| `test` / `test:watch` / `test:coverage` | Vitest                   |
| `cspell`                                | Spell check              |
| `knip`                                  | Unused code detection    |

## Tooling

Borrowed from [`cna-templates`](https://github.com/Create-Node-App/cna-templates) and [`nextjs-saas-ai-template`](https://github.com/Create-Node-App/nextjs-saas-ai-template):

- **ESLint 9** flat config — `eslint-plugin-astro`, `typescript-eslint`, `eslint-plugin-import`, `jsx-a11y`
- **Prettier** + `prettier-plugin-astro`
- **commitlint** + **Husky** + **lint-staged** — Conventional Commits, pre-commit lint+format
- **cspell** + **MegaLinter** — spell + super-linter (JS flavor)
- **Vitest** + `jsdom` + `@testing-library/jest-dom` — unit tests, coverage thresholds (lines 25%)
- **Codecov** — coverage upload (optional `CODECOV_TOKEN`)
- **Dependabot** + **Danger** — dependency updates + PR hygiene

## Documentation

- [Docs index](./docs/README.md)
- [Project structure & feature guide](./docs/PROJECT_STRUCTURE.md)
- [Components & styling](./docs/COMPONENTS_AND_STYLING.md)
- [State management](./docs/STATE_MANAGEMENT.md)
- [Project configuration](./docs/PROJECT_CONFIGURATION.md)
- [GitHub setup & CI](./docs/GITHUB_SETUP_GUIDE.md)
- [Testing guide](./docs/TESTING_GUIDE.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Uses **Trunk Based Development** (`main` is trunk, short-lived `feat/*` / `fix/*` branches), Conventional Commits, and Husky gates.

## Deployment

`pnpm build` outputs static `dist/` — deploy to Vercel, Netlify, Cloudflare Pages, or any static host. For SSR, add an [Astro adapter](https://docs.astro.build/en/guides/deploy/).

## License

MIT — see [LICENSE](./LICENSE).
