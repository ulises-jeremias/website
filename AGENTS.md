# AGENTS.md — AI Interaction & Execution Guide (Humans: see CONTRIBUTING.md & docs/)

This file is scoped for AI assistants (Cursor, Copilot Chat, PR bots). Humans: read `CONTRIBUTING.md` and `docs/`.

## 1. Authoritative References (Never Reproduce Content Here)

| Topic                                  | Source of Truth                  |
| -------------------------------------- | -------------------------------- |
| Project architecture & feature modules | `docs/PROJECT_STRUCTURE.md`      |
| Components & styling                   | `docs/COMPONENTS_AND_STYLING.md` |
| State & content data flow              | `docs/STATE_MANAGEMENT.md`       |
| Project / build configuration          | `docs/PROJECT_CONFIGURATION.md`  |
| GitHub / CI                            | `docs/GITHUB_SETUP_GUIDE.md`     |
| Testing                                | `docs/TESTING_GUIDE.md`          |

## 2. Key Commands (pnpm)

| Command                             | Purpose                            |
| ----------------------------------- | ---------------------------------- |
| `pnpm dev`                          | Astro dev server (4321)            |
| `pnpm build`                        | Static build → `dist/`             |
| `pnpm preview`                      | Preview production build           |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (flat, astro+ts+import)     |
| `pnpm format` / `pnpm format:check` | Prettier (astro plugin)            |
| `pnpm type-check`                   | `astro check`                      |
| `pnpm test` / `pnpm test:coverage`  | Vitest (jsdom, coverage 25% lines) |
| `pnpm test:visual`                  | Playwright browser quality         |
| `pnpm performance:check`            | Route delivery budgets             |
| `pnpm cspell`                       | Spell check                        |

Use `pnpm` only — `npm`/`yarn` are not supported (`packageManager: pnpm@10.28.1`).

## 3. Operating Principles

- **Docs-first** — read `docs/PROJECT_STRUCTURE.md` before proposing code.
- **Content-first** — collections + static HTML > client state. Add islands (`npx astro add react`) only when needed, with `client:*` directive.
- **Feature-based** — `src/features/<domain>` with `components/`, `services/`, `types/`, `hooks/`, `index.ts` public API. Copy `_feature-template_` for new features.
- **Type safety** — Zod schemas in `content.config.ts`, strict TS (noImplicitAny relaxed for Astro frontmatter, see `tsconfig.json`).
- **CI is law** — `lint`, `format:check`, `type-check`, `test:coverage`, `build` must pass on `main`. Draft PRs skip CI; mark ready to run.
- **Honest claims** — do not imply islands, adapters, or backends not installed.

## 4. AI Execution Protocol

When asked to add pages, content, or components:

1. Read `docs/PROJECT_STRUCTURE.md` and relevant guide.
2. Place routes in `src/pages/` (thin), logic in `src/features/<domain>`, shared in `src/shared/`.
3. Extend `src/content.config.ts` + `src/content/<name>/` for new collections.
4. Use alias `@/` → `src/` and respect `import/order`.
5. Present file tree + diff plan before large changes.
6. After changes: `pnpm format`, `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build` (or subset relevant).

## 5. Guardrails

- Do NOT fabricate file paths, collections, or Astro APIs.
- Do NOT add global client stores for static marketing content.
- Do NOT remove a11y semantics without replacement.
- Do NOT commit `node_modules/`, `dist/`, `coverage/`, `.env`, `pnpm-lock.yaml` conflicts (keep frozen).
- Flag new UI framework / adapter integrations for human confirmation.

## 6. Content & Page Checklist

- Frontmatter matches `content.config.ts` Zod schema.
- Pages filter `draft` entries where appropriate.
- `BaseLayout` receives `title` + `description` for SEO.
- Links point to existing routes (`/`, `/blog`).
- Scoped vs global CSS choice is intentional.

## 7. When to Ask or Refuse

**Ask** if: collection schema unclear, SSR vs static tradeoff unresolved, missing target route, feature boundary ambiguous.

**Refuse** if: asked to bypass validation, commit build artifacts/secrets, or invent integrations not installed.

## 8. Post-Change Report

Return bullets:

- Files touched (concise)
- New dependencies (if any)
- Lint / type-check / test / build status
- Manual QA suggestion (`/`, `/blog`, content edits)
- Deferred items (islands, adapters, E2E)

---

Maintained for `ulises-jeremias/website` (Astro 7 + pnpm + feature-based, parity with `Create-Node-App` templates). Humans: stop reading — go to `CONTRIBUTING.md` + `docs/`.
