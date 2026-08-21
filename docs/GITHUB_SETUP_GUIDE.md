# GitHub Setup & CI — website

CI is **required** on `main` — every PR must pass before merge. Setup mirrors [`nextjs-saas-ai-template`](https://github.com/Create-Node-App/nextjs-saas-ai-template) and `all-github-setup` extension.

## Workflows (`.github/workflows/`)

| Workflow              | Trigger                  | Purpose                                               |
| --------------------- | ------------------------ | ----------------------------------------------------- |
| `build.yml`           | push/PR to `main`        | `pnpm build` (Astro static)                           |
| `lint.yml`            | push/PR to `main`        | `pnpm lint` + `pnpm format:check`                     |
| `type-check.yml`      | push/PR to `main`        | `pnpm type-check` (`astro check`)                     |
| `tests.yml`           | push/PR to `main`        | `pnpm test:coverage` + Codecov upload                 |
| `browser-quality.yml` | push/PR to `main`        | Route budgets, Chromium goldens, Firefox/WebKit smoke |
| `mega-linter.yml`     | PR to `main` (non-draft) | MegaLinter (JS flavor) — reads `.mega-linter.yml`     |
| `pr-review.yml`       | PR to `main` (non-draft) | Danger.js — PR hygiene (see `dangerfile.ts`)          |
| `todo.yml`            | push to `main`           | `todo-to-issue` — converts TODOs to issues            |

Node workflows use `pnpm/action-setup@v6` + `actions/setup-node@v7` with
`node-version-file: .node-version` and `cache: 'pnpm'`, plus
`pnpm install --frozen-lockfile`. Browser quality installs pinned Chromium,
Firefox, WebKit, and their Linux host dependencies through Playwright.

**Draft PRs** are excluded from build/lint/type-check/tests/mega-linter (see `if: draft == false`) to save minutes — mark ready for review to run CI.

## Branch protection

Enable on `main`:

- Require PR before merging
- Require status checks: `build`, `lint`, `type-check`, `test`, `browser`
- Require branches up to date
- Dismiss stale approvals
- Restrict push to maintainers

Repository settings, not this document, determine whether these checks are
enforced. Verify the active rule after changing workflow job names.

## Dependabot (`.github/dependabot.yml`)

Weekly updates for `npm` (pnpm manifests) and `github-actions`. PRs auto-group by ecosystem. Review weekly; merge after CI green.

## Templates

- `ISSUE_TEMPLATE/` — `bug-report.yml`, `feature-request.yml`, `documentation.yml`, `config.yml` (blank issues disabled)
- `PULL_REQUEST_TEMPLATE.md` — Description, Type of Change, How Tested, Checklist (Danger checks sections + checklist)
- `CODE_OF_CONDUCT.md`

## MegaLinter (`.mega-linter.yml`)

- Flavor `javascript` (via `oxsecurity/megalinter/flavors/javascript@v8`)
- `FILTER_REGEX_EXCLUDE` ignores `.git/`, `node_modules/`, `.astro/`, `dist/`, `coverage/`, `pnpm-lock.yaml`
- Disabled linters: `TYPESCRIPT_ES` (covered by ESLint), `JAVASCRIPT_ES`
- `APPLY_FIXES: all` on PRs — auto-fixes via commit or PR (see workflow)

## Danger (`dangerfile.ts` + `tools/danger/`)

Checks PR body for required sections and checklist; warns on large PRs. Workflow copies `tools/danger/*` and runs `danger/danger-js`.

## Local CI parity

Run same as CI before pushing:

```sh
pnpm lint
pnpm format:check
pnpm type-check
pnpm test:coverage
pnpm build
pnpm performance:check
pnpm test:visual
```

## Secrets

- `CODECOV_TOKEN` — optional for coverage upload (Codecov still uploads without token in public repos, `fail_ci_if_error: false`)
- `PAT` — optional for MegaLinter auto-fix push; falls back to `GITHUB_TOKEN`
- `DANGER_GITHUB_API_TOKEN` — optional, falls back to `GITHUB_TOKEN`

## Resources

- [GitHub Actions](https://docs.github.com/en/actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [MegaLinter](https://megalinter.io)
- [Danger.js](https://danger.systems/js/)
