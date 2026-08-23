# UI/UX hardening evidence

> **Historical record:** this file describes the pre-merge hardening baseline from
> 2026-08-21. For the current state after PRs #347–#353, use
> `uiux-assessment-2026-08.md` and `uiux-manual-qa-checklist.md`.

Date: 2026-08-21
Implementation baseline: `main@2a1c562ae7c508f1b686d1c11b537b10d417eadf`
Working branch: `fix/uiux-hardening`

This record separates completed automated work from decisions and validation
that still require a person. It is not a WCAG conformance statement or visual
acceptance record.

## Roadmap status

| Phase                      | Automated status                                                                                                                                   | Remaining gate                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 0. Source of truth         | Current spec, accepted baseline, issue roles, historical documents, and open decisions are indexed in `README.md`.                                 | Human approval is required before closing or rewriting stale issues.                                       |
| 1. Assessment and baseline | Current assessment, browser captures, route budgets, Lighthouse reports, and missing-evidence register exist.                                      | Homepage task testing, route-naming review, and assessment sign-off remain human work.                     |
| 2. High-impact corrections | Trust labels, semantics, drawer behavior, typography, media delivery, SEO, social assets, icons, browser CI, and route budgets are implemented.    | Required checks and `main` protection need repository-administrator action after the new workflow has run. |
| 3. Homepage experiment     | No unapproved hierarchy was shipped.                                                                                                               | Compare contact-first and project-first variants with representative visitors and record the choice.       |
| 4. Optional VSL depth POC  | No WebGL dependency or production code was added. The SVG remains authoritative.                                                                   | OGL remains optional and requires a separate human decision and participant study.                         |
| 5. Route waves             | Open Source, Agent Toolkit, Create Awesome, Dotfiles, Projects, Community, Workstation, and V corrections are implemented.                         | Blog navigation and editorial work remain blocked on the empty-blog product decision.                      |
| 6. Cross-site QA           | Static checks, unit tests, Chromium behavior, Firefox smoke, performance budgets, Lighthouse, review captures, and canonical goldens are complete. | WebKit CI validation, screen-reader pilots, and production feedback remain open.                           |

## Automated evidence

| Check                            | Result                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm format:check`              | Passed.                                                                                                                                       |
| `pnpm lint`                      | Passed with zero errors. Two pre-existing script warnings remain in `scripts/vf-audit.mjs` and `scripts/vf-measure-all.mjs`.                  |
| `pnpm type-check`                | Passed with zero errors. Astro reported existing warnings and hints.                                                                          |
| `pnpm test`                      | 21 files and 164 tests passed.                                                                                                                |
| `pnpm build`                     | 11 static pages built. The intentionally empty Blog collection emits informational warnings.                                                  |
| `pnpm data:create-awesome:check` | Pinned snapshot validated at SHA-256 `3eccdedb81c8f2747f12d66bfc1d74d2ae3a32760ff3e176f90dff8d1ea9cde1`.                                      |
| `pnpm performance:check`         | All mobile and desktop route budgets passed.                                                                                                  |
| `pnpm lighthouse:ci`             | Required assertions passed for 10 routes. Eight LCP warnings remain. Reports are written to `.lighthouse/reports/` and uploaded by CI.        |
| `pnpm audit --audit-level=high`  | Passed with no known vulnerabilities.                                                                                                         |
| `pnpm cspell`                    | New hardening files pass. The full scan still reports 32 existing terms in 11 unrelated files.                                                |
| `pnpm knip`                      | Still reports existing dependency, duplicate-export, and configuration findings outside this roadmap.                                         |
| Chromium                         | 163 checks passed after the product owner accepted the current deployment baseline.                                                           |
| Firefox                          | All 11 routes passed mobile and desktop smoke checks.                                                                                         |
| WebKit                           | Not executed locally because the host lacks `libicu74`, `libxml2`, and `libflite1`. CI installs WebKit with `playwright install --with-deps`. |

The clean Lighthouse 13 run measured performance scores from 0.88 to 0.99.
Accessibility, best-practices, and SEO scores were 1.00 on every audited route.
The maximum lab LCP was 3,537 ms on the homepage, maximum CLS was 0.0453, and
TBT was 0 ms. LCP exceeded the 2,500 ms warning threshold on eight routes. These
are one-run lab measurements and warning signals, not field Core Web Vitals.

The route-byte baseline is maintained in `performance-baseline.json`; limits use
10% byte headroom rounded to 1 KiB plus two requests. Responsive Dotfiles media
reduced the desktop route from 4,370,250 bytes in the initial measurement to
approximately 306 KB in the current baseline. Mobile fell from 2,482,487 bytes
to approximately 180 KB.

## Visual evidence

Normal Chromium runs write 24 current review captures to
`test-results/uiux-review/`: mobile and desktop views for every public route and
404, plus homepage full-page captures. The browser-quality workflow uploads
`test-results/`, Playwright diffs, and Lighthouse reports. It does not update
canonical goldens.

All ten files in `public/social/` were technically reviewed at 1200x630 on
2026-08-21. Text and route artwork remain inside the safe canvas, and no card
showed clipping or missing assets. This review verifies rendering, not product
approval of the art direction.

On 2026-08-21, the product owner authorized deployment to production and chose
to continue visual review against the deployed site. The homepage mobile,
mobile drawer, and Agent Toolkit mobile captures became the canonical deployment
baseline. This approval does not close the remaining product decisions below.

## Human acceptance checklist

- Decide homepage hierarchy using contact-first and project-first task tests.
- Decide whether an empty Blog remains in primary navigation.
- Keep or reject the optional OGL VSL POC; production WebGL is not approved.
- Run NVDA with Firefox, VoiceOver with Safari, and TalkBack with Chrome.
- Validate WebKit on the Ubuntu CI host or another host with Playwright system dependencies.
- Review the deployed site and capture follow-up feedback against the canonical goldens.
- Enable `main` protection and require Build, Lint, Typecheck, Tests, and Browser quality after those checks exist on GitHub.
- Record final acceptance in issue #319; keep #19 for hardening, #30 for launch gates, and #15 as the product index.
