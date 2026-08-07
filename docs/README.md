# Docs — website

Source of truth for architecture, patterns, tooling, and CI. Update here when you change structure, APIs, or deployment.

## Index

- [Project structure & feature guide](./PROJECT_STRUCTURE.md) — top-level layout, routing, feature modules, import alias
- [Components & styling](./COMPONENTS_AND_STYLING.md) — Astro components, scoped CSS, islands, accessibility
- [State management](./STATE_MANAGEMENT.md) — content collections, page-local data, islands
- [Project configuration](./PROJECT_CONFIGURATION.md) — Node/pnpm, Astro, TypeScript, ESLint, Prettier, content collections, env
- [GitHub setup & CI](./GITHUB_SETUP_GUIDE.md) — actions, branch protection, Dependabot, Danger, MegaLinter
- [Testing guide](./TESTING_GUIDE.md) — Vitest, coverage, Codecov, adding tests
- [Design tokens](./design/tokens.md) — global palette (C-04), semantic (C-05), themes (C-06), typography (C-07), spacing/grid (C-08), a11y checklist

## Quick links in the app

- Landing: `/`
- Blog index: `/blog`
- Sample post: `/blog/welcome-to-your-blog`
- Feature template: `src/features/_feature-template_/`

## Conventions

- **Feature-based:** `src/features/<domain>` exports via `index.ts` (see PROJECT_STRUCTURE).
- **Content-first:** prefer collections/static HTML over client state.
- **Docs-first:** do not duplicate this index in README/CONTRIBUTING — link here.

## Tooling parity

Borrowed from [Create-Node-App/cna-templates](https://github.com/Create-Node-App/cna-templates) and [nextjs-saas-ai-template](https://github.com/Create-Node-App/nextjs-saas-ai-template) to keep this Astro site CI-ready: pnpm, Husky/lint-staged, commitlint, cspell, MegaLinter, Vitest, GitHub Actions (build/lint/type-check/tests).
