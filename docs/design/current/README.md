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
state, while hover keeps the shared cyan signal. Routes with a distinct shell
identity set `--header-accent` on the section layout; otherwise the shell
inherits `--world-accent`. The body mirrors the route theme and explicit shell
accent so the portaled mobile drawer retains the same world identity. Home and
Sponsor keep the Nest brand accent. On compact viewports, the primary route rail
gives every link a 44×44 CSS-pixel target and repeats the active world color as
a short rule, so route identity is visible without relying on
color alone. The header row compresses to the same touch-height before the rail,
keeping this more usable navigation shorter than the previous two-row shell.

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

PRs #511–#517 continue the route-specific pass: About gains its systems orbit,
Agentic opens on the stack map, the shared navigation gains world-aware active
states and a compact route rail, ImgBot reduces committed image payloads, and
Home turns its four Featured Work areas into responsive atlas portals above
the illustrated island platforms. The Home captures cover desktop, mobile,
320px reflow, and reduced motion; the platform illustration remains static
when reduced motion is requested.

Work's four professional areas now form connected atlas stations: a continuous
route rail on wide screens and a vertical path with art-first reflow on narrow
screens (PR #540). The Agentic map's optional adoption paths are selectable
(Toolkit alone, Workstation + Toolkit, Toolkit + Harness, or all three); only
the chosen stations and their real connections illuminate. Both behaviors keep
their static HTML story, and both have focused responsive and reduced-motion
coverage.

The baseline before the atlas docking-art follow-up was production
`main@d415c4e7` (2026-10-09). It included the VTL foundation path (PR #525),
the full-history fix for inventory refreshes (PR #528), and the refreshed
Agent Toolkit inventory (PR #527). Build, lint, type-check, tests, Browser
Quality, Todo Checker, deployment smoke, and the post-merge inventory-drift
check passed on that baseline. MegaLinter passed on PR #527 and is intentionally
skipped for main push events. Production Smoke verified 26 assertions covering
public routes, metadata, canonical origins, sitemap, robots, RSS, representative
assets, security headers, and caching. The Hornero OS CTA is locked to
`https://horneroos.com`, and a nonexistent route serves the custom 404. PR #524
carries the active world signal between documents with native View Transitions,
while reduced-motion users keep still navigation. Its browser regressions and
route-byte measurements are recorded with the change.

Create Awesome's assembly package now lights attachment sockets for selected
addons (up to six illustrated sockets; the adjacent label shows the exact
selected total). Its
conveyor signal runs only during a composition update; reduced-motion mode
keeps the completed package still. The SVG remains visual reinforcement for
the native composer and its text stage index.

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
