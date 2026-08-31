# Current design and acceptance state

This directory is the index for the maintained Digital Nest UI/UX state. It
separates current specifications and regression artifacts from dated design
exploration.

## Authority order

1. `docs/adr/ADR-003-portfolio-first-ia.md` defines the portfolio-first information architecture: four flagship areas, public labels, and route responsibilities. It supersedes the flat world ordering as the visitor hierarchy while preserving all canonical URLs.
2. `docs/design/synthwave-systems-atlas.md` is the approved visual identity.
3. `src/styles/` contains the maintained production tokens and type roles.
4. `src/data/routes.ts` defines canonical routes and the compact navigation projection; its unit tests lock labels and active-item behavior.
5. `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md` defines the native-control contract for interactive diagrams.
6. `tests/visual/*-snapshots/` contains maintained Chromium visual goldens.
7. `performance-baseline.json` records the measured route delivery baseline.
8. `uiux-assessment-2026-08.md` records the current automated results and unresolved human/product gates. `uiux-hardening-evidence.md` is the historical pre-merge hardening record.
9. `route-identity-briefs-2026-08.md` records the route-identity redesign diagnosis and per-route design briefs.
10. `route-redesign-plan-2026-08.md` records the completed substantial route redesign waves and evidence contract; the portfolio-first IA (ADR-003) amends the route set with `/agentic` and `/about`.

## Accepted baseline

- Visual direction: Synthwave Systems Atlas, approved in issue #52.
- Information architecture: portfolio-first, defined in ADR-003 and tracked
  through issues #392–#405.
- Visual-first route pass: approved by the product owner in commit `4b2171a`
  and merged through PR #325 as `be8ac60`.
- Assessment implementation baseline: `main@fe489798`.
- UI/UX recovery epic: #319 remains open for current corrective work and final
  acceptance.

The maintained snapshots are the regression authority. Captures under dated
`docs/design/` directories are historical evidence and are not rewritten by
normal Playwright runs.

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
- Final product-owner review of new desktop and mobile captures.

Automated checks must not be described as WCAG conformance or human visual
acceptance.
