# Synthwave Systems Atlas Implementation Plan

> Execution note: keep implementation on `design/synthwave-foundation` until
> the first reviewed vertical slice is ready. Do not commit or open a PR without
> explicit user authorization.

**Goal:** Ship a truthful, accessible, static-first Digital Nest in the approved
Synthwave Systems Atlas direction, beginning with the shared foundation and
homepage, then adapting each project world with its own explanatory composition.

**Architecture:** Preserve Astro's feature-based structure. `BaseLayout` owns the
single global CSS entry point and document metadata. `SectionLayout` owns the
single global shell. Canonical typed data drives navigation, project worlds, and
repeated facts. CSS and accessible SVG provide the environment and atlas; route-
local scripts enhance only interactions that need state.

**Stack:** Astro 5, strict TypeScript, Zod, CSS, inline SVG, Vitest, Astro check,
Playwright visual/a11y smoke tests.

## Guardrails

- Never import generated reference facts.
- Preserve existing content, schemas, route contracts, and verified research.
- Add no animation/UI dependency unless native CSS/SVG/HTML proves insufficient.
- Use tests before behavioral implementation where the repository supports it.
- Run targeted checks after each task and the full repository suite at wave
  boundaries.
- Keep issue evidence synchronized only after files and screenshots exist.

## Task 1 — Make the design system executable

**Files**

- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/index.css`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/semantic.css`
- Modify: `src/styles/typography.css`
- Modify: `src/styles/spacing.css`
- Create: `src/styles/motion.css`
- Create: `src/styles/effects.css`
- Modify: `src/styles/themes/index.css`

**Steps**

1. Add a failing static assertion that the built site loads the global CSS
   entry point and required semantic tokens.
2. Import `src/styles/index.css` once from `BaseLayout`.
3. Normalize import order: reset → tokens → typography → spacing → semantic →
   motion → effects → themes.
4. Add the approved primitive palette and stable compatibility aliases required
   by existing routes.
5. Add focus, motion-duration, easing, glow, clipped-corner, atmosphere, and
   reduced-motion primitives.
6. Run:

```bash
pnpm test -- src/data/routes.test.ts
pnpm type-check
pnpm build
```

Expected: tests and Astro diagnostics pass; every route builds with styled
semantic defaults and no undefined-token regression.

## Task 2 — Unify the global shell

**Files**

- Modify: `src/data/routes.ts`
- Modify: `src/data/routes.test.ts`
- Modify: `src/layouts/SectionLayout.astro`
- Modify: `src/shared/components/SiteHeader.astro`
- Modify: `src/shared/components/SiteFooter.astro`
- Modify: `src/shared/components/MobileNav.astro`
- Modify: `src/shared/components/index.ts`
- Delete after migration: `src/shared/components/Header.astro`
- Delete after migration: `src/shared/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Steps**

1. Extend route tests first for a canonical primary navigation projection,
   exactly one active item, and stable route URLs.
2. Add a route helper that derives public navigation from canonical route data.
3. Rebuild `SiteHeader` around the original Digital Nest woven mark, canonical
   links, GitHub utility, active state, and accessible mobile disclosure.
4. Rebuild `SiteFooter` as a compact editorial/technical footer.
5. Move the homepage onto `SectionLayout`; remove duplicate shell components
   only after no imports remain.
6. Test keyboard order and mobile-menu behavior at 390 px.
7. Run:

```bash
pnpm test -- src/data/routes.test.ts
pnpm type-check
pnpm build
```

Expected: one shell is rendered on every route, active state is route-derived,
and no duplicate navigation definition remains.

## Task 3 — Canonicalize homepage truth

**Files**

- Modify: `src/data/profile.ts`
- Modify: `src/data/project-worlds.ts`
- Modify: `src/features/home/data/index.ts`
- Add/modify tests under: `src/data/*.test.ts`

**Steps**

1. Add failing tests that all homepage world links resolve through route data,
   world numbers are unique, relationships target real worlds, and public copy
   contains no issue IDs or placeholder/fake metric labels.
2. Replace emoji fields with typed illustration identifiers.
3. Add explicit project-world accent/theme and illustration metadata.
4. Keep role, location, summary, links, and availability sourced from profile
   data; do not duplicate them in Astro templates.
5. Model the lower status panel with qualitative or repository-verified facts
   only.
6. Run:

```bash
pnpm test
pnpm type-check
```

Expected: all data invariants pass and the homepage can render without invented
metrics or emoji icons.

## Task 4 — Build the homepage environment

**Files**

- Create: `src/features/home/components/NestMark.astro`
- Create: `src/features/home/components/SynthwaveEnvironment.astro`
- Modify: `src/features/home/components/Hero.astro`
- Modify: `src/styles/home.css`
- Modify: `src/pages/index.astro`

**Steps**

1. Implement an original SVG star/haze, striped CSS sunset, mountain/skyline
   silhouettes, and perspective grid.
2. Implement the asymmetric two-column hero with accessible HTML
   `ULISES JEREMIAS`, Digital Nest wordmark, verified profile copy, keyword
   separators, and angular CTAs.
3. Keep all environment art decorative and pointer-inert.
4. Recompose at tablet/mobile; do not scale desktop typography or art blindly.
5. Add complete reduced-motion and forced-colors fallbacks.
6. Run:

```bash
pnpm format:check
pnpm lint
pnpm type-check
pnpm build
```

Expected: strong synthwave atmosphere without raster wallpaper or hero JS; text
remains readable at 390, 768, 1024, and 1440 px.

## Task 5 — Build the connected project-world atlas

**Files**

- Create: `src/features/home/components/ProjectAtlas.astro`
- Create: `src/features/home/components/ProjectWorld.astro`
- Create: `src/features/home/components/WorldIllustration.astro`
- Create: `src/features/home/components/AtlasConnections.astro`
- Modify: `src/features/home/data/index.ts`
- Modify: `src/styles/home.css`

**Steps**

1. Render all nine route-backed worlds as real links.
2. Draw original project-specific SVG motifs and irregular platform bases.
3. Generate relationship paths from canonical cross-link data.
4. Use CSS `:hover`, `:focus-visible`, and `:has()` with a functional fallback
   so keyboard and pointer activate the same world/relationship state.
5. Render a central woven Digital Nest hub.
6. Replace the desktop scatter map with a connected vertical path at mobile
   widths.
7. Disable floating/pulsing motion under reduced motion.
8. Run targeted data tests, type-check, build, and keyboard browser smoke.

Expected: nine memorable, connected world links; no generic card grid; no
interaction requires JavaScript.

## Task 6 — Build the homepage evidence transition

**Files**

- Create: `src/features/home/components/NestStatus.astro`
- Create: `src/features/home/components/AboutPanel.astro`
- Create: `src/features/home/components/FeaturedProjectLedger.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`

**Steps**

1. Implement distinct technical-panel, editorial-block, and ledger-row
   structures.
2. Use verified current focus/profile/project data only.
3. Use the repository avatar only if the source and license are verified;
   otherwise use the abstract Nest mark.
4. Remove fake metrics, skill pills, and unverified language/star metadata.
5. Validate reading order and headings independently of the desktop grid.

Expected: the visual narrative transitions from atmosphere to evidence without
fabricated telemetry.

## Task 7 — Add deterministic homepage visual coverage

**Files**

- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `tests/visual/home.spec.ts`
- Create: `tests/visual/shell.spec.ts`
- Modify: `.gitignore` if generated artifacts need exclusion
- Modify: `docs/TESTING_GUIDE.md`

**Steps**

1. Add Playwright as a development dependency only if absent.
2. Configure a deterministic local Astro preview, reduced motion, fixed
   viewport/color scheme, disabled caret/animations, and stable screenshot path.
3. Add 1440 × 1100 and 390 × 844 homepage screenshots.
4. Add mobile navigation open and reduced-motion screenshots.
5. Add semantic smoke assertions: one `h1`, nine atlas links, visible focus,
   no horizontal overflow, no obvious accessibility violations available from
   the selected tooling.
6. Run:

```bash
pnpm test:visual --update-snapshots
pnpm test:visual
```

Expected: deterministic baselines under `tests/visual/**` or the repository's
chosen snapshot convention.

## Task 8 — Review and iterate the homepage

**Evidence**

- Save desktop/mobile review captures under
  `docs/design/final/2026-08-07/home/`.
- Compare with the approved reference for identity/atlas balance, atmosphere,
  hierarchy, density, and mobile story.

**Steps**

1. Run the site and capture 1440 and 390 px screenshots.
2. Inspect screenshots visually; do not approve based only on tests.
3. Fix overlap, tiny labels, weak atmosphere, excessive glow, or generic-card
   drift.
4. Run a dedicated code review and address high-confidence findings.
5. Execute the full wave gate:

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm type-check
pnpm test
pnpm test:coverage
pnpm build
pnpm cspell
pnpm knip
```

Expected: all configured checks pass or each unavailable/known baseline failure
is recorded with exact evidence.

## Task 9 — Agent Toolkit flagship route

**Files**

- Modify: `src/features/agent-toolkit/data/index.ts`
- Replace/modify components under:
  `src/features/agent-toolkit/components/`
- Modify: `src/styles/themes/toolkit.css`
- Add route-local interaction script/component only if native HTML cannot
  express recipe and Herdr/tmux state.
- Add tests under: `tests/visual/agent-toolkit.spec.ts`

**Steps**

1. Reconcile all copy and recipes with Agent Toolkit HEAD.
2. Implement source core → capability families → targets.
3. Replace six identical cards with one selectable capability anatomy.
4. Implement request → recipe → roles → worktrees → handoffs → state →
   governance → artifact.
5. Implement factual pair/team/full variants.
6. Implement Herdr/tmux as two views of the same state.
7. Provide static content and reduced-motion equivalents.
8. Capture 1440/390 plus variant screenshots.

Expected: an unfamiliar developer can explain capability types, swarm
orchestration, governance, and UI-backend parity from the page.

## Task 10 — Personal DX worlds

**Files**

- Modify components/data/styles under:
  - `src/features/dotfiles/`
  - `src/features/workstation/`
  - `src/styles/dotfiles.css`
  - `src/styles/themes/workstation.css`
- Add visual specs for both routes.

**Steps**

1. Verify and import only licensed first-party screenshots.
2. Build Dotfiles as a personal desktop environment, including the actual Smart
   Colors wallpaper → palette → scheme → targets flow with pause/replay/static
   states.
3. Build Workstation as a machine → provisioning → tools → agent/runtime →
   ready story.
4. Show the verified Personal DX graph, not an aesthetically convenient fiction.
5. Capture 1440/390 screenshots and interaction states.

## Task 11 — V and Create Awesome worlds

**Files**

- Modify: `src/features/v/`
- Modify: `src/features/create-awesome/`
- Modify: `src/styles/themes/v.css`
- Modify: `src/styles/themes/create-awesome.css`
- Add route visual specs.

**Steps**

1. Reconcile VSL/VTL/RxV/setup-v claims and maturity with canonical repos.
2. Implement scientific/computational stages: transformation, computation graph,
   stream, and CI setup.
3. Implement Create Awesome runtime + template + addon composition with a
   truthful command generator and native form controls.
4. Capture 1440/390 and composer state.

## Task 12 — Community and Blog worlds

**Files**

- Modify: `src/features/community/`
- Modify: `src/features/blog/`
- Modify route styles/components as required.
- Add visual specs.

**Steps**

1. Build Community as a verified contributor/workshop network with real
   endpoints and no counts.
2. Reduce Blog energy: editorial typography, excellent code blocks, subdued
   atmosphere, and no looping environment behind articles.
3. Capture index/article and 1440/390 states.

## Task 13 — Projects and Open Source worlds

**Files**

- Modify: `src/features/projects/`
- Modify: `src/features/open-source/`
- Add visual specs.

**Steps**

1. Replace large card grids with dense grouped ledger/timeline structures.
2. Show owned, maintained, organization, and external contributions only from
   canonical data.
3. Add filters only when they materially improve navigation and remain useful
   without JavaScript.
4. Capture 1440/390 screenshots.

## Task 14 — Cross-site final QA and backlog evidence

**Files**

- Expand: `tests/visual/`
- Update: `docs/COMPONENTS_AND_STYLING.md`
- Update: `docs/TESTING_GUIDE.md`
- Update relevant ADRs only for actual architectural decisions.
- Store final captures under: `docs/design/final/2026-08-07/`

**Steps**

1. Cover all ten required routes at 1440 and 390 px.
2. Run Chromium, Firefox, and WebKit where supported.
3. Test keyboard, 200% zoom, 320 px reflow, reduced motion, forced colors,
   mobile nav, and all explanatory controls.
4. Measure route JS, fonts, image/SVG weight, LCP, and CLS.
5. Re-run the full repository gate.
6. Run code/security review appropriate to the final changes.
7. Update GitHub issues with exact files, screenshot paths, test output, and
   acceptance-criteria status. Close only criteria actually met.
8. Produce the final implementation report, including limitations.

Expected: repository checks pass, screenshots exist for every required route,
and backlog status matches the delivered product rather than planned work.
