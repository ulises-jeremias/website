# Current design and acceptance state

This directory is the index for the maintained Digital Nest UI/UX state. It
separates current specifications and regression artifacts from dated design
exploration.

## Authority order

1. `docs/design/synthwave-systems-atlas.md` is the approved visual identity.
2. `src/styles/` contains the maintained production tokens and type roles.
3. `src/data/routes.ts` defines canonical routes and the compact navigation projection; its unit tests lock labels and active-item behavior.
4. `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md` defines the native-control contract for interactive diagrams.
5. `tests/visual/*-snapshots/` contains maintained Chromium visual goldens.
6. `performance-baseline.json` records the measured route delivery baseline.
7. `uiux-assessment-2026-08.md` records the current automated results and unresolved human/product gates. `uiux-hardening-evidence.md` is the historical pre-merge hardening record.
8. `route-identity-briefs-2026-08.md` records the route-identity redesign diagnosis and per-route design briefs.
9. `route-redesign-plan-2026-08.md` records the active substantial route redesign waves and evidence contract.

## Accepted baseline

- Visual direction: Synthwave Systems Atlas, approved in issue #52.
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

- Homepage hierarchy: compare contact-first and project-first variants before
  changing the accepted composition.
- Empty Blog navigation: remove it from the primary projection or commit to a
  publishing cadence after product-owner review.
- Production WebGL: not approved. Any OGL experiment remains local to the VSL
  station and requires a separate decision after comparative testing.

## Missing human evidence

- Manual screen-reader pilots with NVDA/Firefox, VoiceOver/Safari, and
  TalkBack/Chrome.
- Representative visitor testing for homepage hierarchy and route naming.
- Final product-owner review of new desktop and mobile captures.

Automated checks must not be described as WCAG conformance or human visual
acceptance.
