# Current design and acceptance state

This directory is the index for the maintained Digital Nest UI/UX state. It
separates current specifications and regression artifacts from dated design
exploration.

## Authority order

1. `docs/adr/ADR-003-portfolio-first-ia.md` defines the portfolio-first information architecture: four flagship areas, public labels, and route responsibilities. It supersedes the flat world ordering as the visitor hierarchy while preserving all canonical URLs.
2. `docs/design/synthwave-systems-atlas.md` is the approved visual identity.
3. `iconography.md` and `textures.md` define the icon and background texture contracts.
4. `src/styles/` contains the maintained production tokens and type roles.
5. `src/data/routes.ts` defines canonical routes and the compact navigation projection; its unit tests lock labels and active-item behavior.
6. `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md` defines the native-control contract for interactive diagrams.
7. `tests/visual/*-snapshots/` contains maintained Chromium visual goldens.
8. `performance-baseline.json` records the measured route delivery baseline.
9. `uiux-assessment-2026-08.md` is a dated August 2026 assessment; its measurements and baseline are historical. The current production evidence is recorded below and in the manual QA checklist. `uiux-hardening-evidence.md` is the historical pre-merge hardening record.
10. `route-identity-briefs-2026-08.md` records the route-identity redesign diagnosis and per-route design briefs.
11. `route-redesign-plan-2026-08.md` records the completed substantial route redesign waves and evidence contract; the portfolio-first IA (ADR-003) amends the route set with `/agentic` and `/about`.
12. `writing-system.md` defines article structure, Markdown conventions, and progressive code-copy behavior for Field Notes.

## Accepted baseline

- Visual direction: Synthwave Systems Atlas, approved in issue #52.
- Information architecture: portfolio-first, defined in ADR-003 and tracked
  through issues #392–#405.
- Visual-first route pass: approved by the product owner in commit `4b2171a`
  and merged through PR #325 as `be8ac60`.
- Current production baseline: the latest successful deployment of `main`;
  exact revision and release checks are recorded in issue #405.
- This revision is deployed to production. Build, lint, type-check, tests,
  route budgets, Lighthouse, browser quality, Todo Checker, and deployment smoke
  pass. Portfolio release evidence remains tracked in #405; manual
  assistive-technology validation remains tracked separately in #295.

The maintained snapshots are the regression authority. Captures under dated
`docs/design/` directories are historical evidence and are not rewritten by
normal Playwright runs.

The shared header uses each route's world accent for its active navigation
state and its secondary world accent for hover. Routes with a distinct shell
identity define `--header-accent` and `--header-accent-secondary`; otherwise the
shell inherits `--world-accent` tokens. Home and Sponsor keep the Nest brand
accent.

PRs #462–#471 established the current route baselines and portfolio-first
hierarchy. PRs #473–#494 then added route-specific interactions and visual work
for HorneroConfig, Sponsor, About, Agent Toolkit, Agentic Workstation, Create
Awesome, V, and the homepage atlas. PR #494 updated the atlas's responsive
fallbacks; PR #495 added the VSL signal analyzer. PRs #496–#497 restored and
compressed Create Awesome artwork, and PRs #498–#499 stabilized generated-data
checks. PR #500 turns Hornero OS's
actual manifest into a user-triggered assembly trace. Pinned and local entries
dock into the composition; installer and ISO slots remain visibly reserved.
The route retains its static fallback and reduced-motion behavior. PR #501
refreshed this authority index against the deployed `main@043ebb63` state. Pull
request 502 reshaped Community as an isometric workshop with a distinct mobile
circuit, keyboard-selectable project stations, and reduced-motion-aware route
pulses.

At the historical `main@352b855c` Community release, 575 Playwright cases
passed along with Lighthouse, build, lint, type-check, unit tests, route
budgets, Todo Checker, and deployment smoke. PRs #503–#510 have since extended
the current route experience with the Create Awesome assembly sequence, V lab
station map, kinetic homepage portals and world docking plates, the interactive
404 route finder, Smart Colors signal trace, and the Field Notes desk visual
refinement. Their reviewed snapshots are maintained alongside the route tests.

Current `main` is deployed to production. Build, lint, type-check,
tests, Browser Quality (route budgets, Lighthouse, and the full browser
matrix), Todo Checker, and deployment smoke passed on this exact revision;
MegaLinter passed on PR #510 and is intentionally skipped for main push events.
Production checks return 200 for all 15 public routes, `/sitemap.xml`,
`/robots.txt`, and `/rss.xml`, and confirm `/hornero-os/` links to
`https://horneroos.com`. A nonexistent route serves the custom 404. Visual
goldens change only for the route-specific designs reviewed in each PR.

## Historical documents

- `docs/design/tokens.md` is the superseded warm/light token proposal.
- `docs/design/navigation.md` is the superseded nine-world navigation proposal.
- `docs/design/visual-first/` records the 2026-08-09 review process and accepted
  route pass; it is not an active backlog.
- `docs/design/final-production/` and dated baseline directories are comparison
  evidence, not current specifications.

## Open product decisions

- Homepage flagship hierarchy: the portfolio-first evolution (#392–#405)
  replaces the contact-first vs project-first comparison with the accepted
  ADR-003 hierarchy.
- Empty Blog navigation: the Writing label (#396) defines a deterministic
  promotion rule after the first published post.
- Production WebGL: not approved. Any OGL experiment remains local to the VSL
  station and requires a separate decision after comparative testing.

## Missing human evidence

- Manual screen-reader pilots with NVDA/Firefox, VoiceOver/Safari, and
  TalkBack/Chrome.
- Representative visitor testing for homepage hierarchy and route naming.
- Real-device touch exploration and human zoom/reflow review, as detailed in
  #295. Automated accessibility results do not substitute for these checks.

Automated checks must not be described as WCAG conformance or human visual
acceptance.
