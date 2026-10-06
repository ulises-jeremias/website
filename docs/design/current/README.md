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
- Current production baseline: `main@8f1d056bde19c917a18d7d21bcbbf5d5dc8ffbae` (PRs #462, #464, and #467–#471).
- The route redesign, accessibility navigation correction, production deployment,
  and automated release checks are complete on this baseline. Portfolio release
  evidence is tracked in issue #405; manual assistive-technology validation
  remains tracked separately in #295.

The maintained snapshots are the regression authority. Captures under dated
`docs/design/` directories are historical evidence and are not rewritten by
normal Playwright runs.

The 2026-10-05 refresh in PR #462 updates the Agent Toolkit, Agentic, Hornero OS,
and Sponsor mobile goldens. Their previous CI baselines no longer matched the
current Linux browser renders; the captures were reviewed at 390px and preserve
the intended route hierarchy and readable wrapping. PR #464 then updated the
navigation accessible name and V repository-link target. PR #467 adds the
manifest-driven Create Awesome composition sequence; PR #468 adds an on-demand
trace through Hornero OS's actual manifest. The Hornero OS trace now announces
each pinned, local, or future manifest entry to assistive technology, animates
the active row, and holds the final reserved-slot state long enough to read.
Both interactions keep a complete static fallback and respect reduced motion.
PR #469 refreshes this current-production record; PR #470 adds an optional
Agentic stack relationship trace. At `main@8f1d056`, build, tests, type-check,
lint, browser quality (533 Playwright tests plus Lighthouse CI), deployment
smoke, and route budgets pass. Other goldens remain unchanged.

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
