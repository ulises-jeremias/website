# UI/UX Design Assessment — Digital Nest website

**Product:** ulises-jeremias.dev (Digital Nest) · **Commit audited:** `main@fe489798` (identical to production deployment) · **Period:** 2026-08-23
**Assessor:** ox-alpha orchestration (5 parallel specialist reviews) · **Purpose:** end-to-end baseline before next visual iteration · **Audience:** site owner + future contributors
**Method:** `design-assessment` router — parallel evidence fan-out (structural map, axe-core ×22 combos, production E2E flows, head/SEO/governance audit, contrast probe, reflow checks, and heuristic visual review). No fake precision: ratings carry confidence; severity bands are Blocking/Major/Minor.

---

## Evidence summary

| Source                                                                        | Location                                                                    | Freshness  | Strength    | Confidence   | Indicators informed                                        |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------- | ----------- | ------------ | ---------------------------------------------------------- |
| axe-core 4.13.0 pre-fix run (22 combos: 11 routes × mobile/desktop)           | Historical session artifact; current CI revalidated the fixes               | 2026-08-23 | Historical  | Medium       | A11y, Semantics                                            |
| Production E2E pre-fix flows (F1–F10, 91 assertions, 23 screenshots)          | Historical session artifact; current browser suite revalidated the flows    | 2026-08-23 | Historical  | Medium       | UX friction, Interaction, Consistency                      |
| Head/SEO pre-fix audit (11 routes, JSON-LD ×13, sitemap/RSS/manifest)         | Historical session artifact; current build spot-check below                 | 2026-08-23 | Historical  | Medium       | Content trust, Compliance, Governance                      |
| Structural map (routes/components/tokens/tests inventory)                     | Historical review artifact; current source tree and CI provide the baseline | 2026-08-23 | Historical  | Medium       | System shape, Coverage gaps                                |
| Vision-based visual review (text-only heuristic — harness vision unavailable) | src/styles/* + atlas doc + production/CI captures                           | 2026-08-23 | Indirect    | Low          | Distinctiveness, Hierarchy, Typography, Responsive quality |
| Current main CI baseline (Browser quality)                                    | GitHub run `32665651809`                                                    | 2026-08-23 | Direct      | High         | Performance, A11y, Responsive, Regression                  |
| Current production route sweep                                                | `https://www.ulises-jeremias.dev` — 11 routes, no details/Inspect markup    | 2026-08-23 | Direct      | High         | Content discoverability, Responsive                        |
| Screen-reader pilots (NVDA / VoiceOver / TalkBack)                            | —                                                                           | —          | **Missing** | Not assessed | A11y (deep)                                                |

---

## What is already excellent (keep & protect)

- **Interaction correctness is exceptional:** the pre-fix production flow baseline passed 89/91 assertions; current CI passes 206/206 browser checks. Mobile drawer implements the full isolation grammar (dialog semantics, `inert`, focus trap, Esc restore, scroll lock). Composer conflict handling is _prevention-first_ (locked partner + dimmed + `aria-disabled` + explanatory status). Shareable project filters announce counts via live region and survive deep-linking.
- **Semantic discipline:** the current build has one `<h1>` per generated route, zero heading-order violations, one `<main>`, a valid skip link, 50/50 images with an `alt` attribute, and zero button/link misuse found in the current spot-check.
- **Diagram contract honored where it ships:** Dotfiles LayersDiagram and WorkstationSystemMap implement the native-radio + hidden-SVG + status pattern from `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md`, with tests.
- **Performance governance is fail-closed:** per-route byte budgets (script ≈ 0 on most worlds), Lighthouse error thresholds ≥0.9 for indexable routes, and explicit 404 coverage with SEO skipped because it is intentionally `noindex, nofollow`; CSS-only motion has a global reduced-motion kill-switch.
- **Content trust chain:** social cards 10/10 correct (1200×630, alt, live), current JSON-LD blocks 11/11 valid, canonical host guarded at build time, pinned Create Awesome snapshot verified by SHA.

---

## Implementation status (applied in this delivery)

Every machine-checkable finding below was implemented and verified across PRs #347, #348, #350, #351, #352, and #353. Current local verification: `format:check` ✅ · `lint` 0 errors ✅ · `type-check` 0 errors ✅ · `test` 21 files / 165 tests ✅ · `build` 11 pages ✅ · `scripts/check-contrast.mjs` **0 solid-color violations** ✅ · reflow **22/22** (320px and 640px equivalent) ✅ · `performance:check` ✅ · `lighthouse:ci` ✅. The GitHub Actions Browser quality run `32665651809` on `main@fe489798` passed with Playwright 1.62.1 on `ubuntu-latest` (Chromium + Firefox + WebKit), including the added 404 and 640px-equivalent coverage.

- **Blocking 1** — `tabindex="-1"` on decorative SVG anchors in `ResponsibilityTopology.astro`.
- **Major 2** — deleted 24 orphan components + 2 residual orphans (`WorkstationAtlas`, entire `agentic-workstation` feature); pruned 8 barrels.
- **Major 3** — added `tests/visual/pr6b-nexus-convergence.spec.ts` (SVG visual-only + keyboard/pointer convergence).
- **Major 4** — shipped `scripts/check-contrast.mjs`; probe reports 0 sub-threshold nodes after lightening the nexus chip count via `color-mix`; only the hero gradient text remains as manual-review.
- **Major 5** — retracted (false positive: `<header>`/`<footer>` present on every route via `SectionLayout`).
- **Minor 6–11** — sitemap → `sitemap.xml`; meta descriptions lengthened (blog/open-source/create-awesome); projects dates localized; `rel="noopener noreferrer"` normalized (37 anchors); scrubber `aria-label="Stage N of M"`; reduced-motion Play announces via a self-managed live region.

**Remaining gates:** screen-reader pilots (NVDA/VoiceOver/TalkBack), manual sampling of gradient/clipped text contrast, real 200% browser zoom, subjective visual/brand sign-off, representative visitor testing for homepage hierarchy, the empty Blog navigation/product decision, final owner review of production captures, and ongoing production feedback. The repository includes `docs/design/current/uiux-manual-qa-checklist.md`; automated contrast, reflow, mobile snapshots, dead-code, and CSS-cleanup items are complete.

---

## Design-unit scorecard (1–5 · confidence)

| Indicator                         | Score | Confidence | Basis                                                                                                                          |
| --------------------------------- | ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Visual identity / distinctiveness | **3** | Low        | Heuristic (vision unavailable): token system, type scale, motion rules documented + test-locked; aesthetic unverified          |
| Hierarchy & layout                | **3** | Low        | Heuristic: single primary action per view + documented rhythm; visual pacing unverified                                        |
| UX friction / interaction         | **4** | High       | Flows F1–F10 near-perfect; feedback patterns consistent                                                                        |
| Consistency                       | **4** | High       | Cross-route shell, visible content sections, labels, and CTA patterns are consistent; dead CSS was removed                     |
| Accessibility                     | **4** | Medium     | Automated semantics, contrast, reflow, keyboard, focus, and axe checks pass; screen-reader pilots and gradient sampling remain |
| Responsiveness                    | **4** | High       | 320px and 640px-equivalent reflow pass on 11 routes; mobile snapshots cover all flagship worlds; human device review remains   |
| Design-system compliance          | **4** | High       | Tokens and diagram contract are test-backed; nexus convergence and stale CSS gaps are closed                                   |
| Performance (UI)                  | **4** | High       | Fail-closed budgets + green CI Lighthouse + CSS-only ambient motion                                                            |

**Overall narrative:** the site now has a strong, content-forward UX foundation: primary content is visible, interactions are keyboard- and pointer-safe, route budgets remain green, and mobile reflow is tested rather than assumed. The remaining gap is not automated correctness but human, product, and design judgment: screen-reader behavior, gradient contrast, real browser zoom, visitor feedback, Blog direction, and final visual/brand sign-off.

---

## Findings (severity-ranked, evidence-cited)

> The observations below are retained for traceability. Every machine-checkable item is **resolved and verified** in PRs #347, #348, #350, #351, #352, and #353; only the human and product/design gates listed below remain.

### Blocking

- **1 — [A11y · WCAG 2.x A 4.1.2] Focusable links hidden behind `aria-hidden="true"`**
  - **Observation:** `.dx-topology__visual` container sets `aria-hidden="true"` (`src/shared/components/ResponsibilityTopology.astro:48`) while containing `<a href>` diagram nodes (`:68`). Fires `aria-hidden-focus` [serious] on desktop `/`, `/agent-toolkit/`, `/agentic-workstation/`.
  - **Impact:** keyboard/SR users can tab into links that assistive tech is told to ignore — invisible focus stops on 3 high-traffic routes.
  - **Effort:** S · **Severity:** Blocking · **Confidence:** High
  - **Recommended fix:** add `tabindex="-1"` to the anchors inside the decorative SVG (the accessible duplicate lives in `.dx-topology__structured`, `:104`); drop the now-dead `.dx-topology__node:focus-visible` rule (`:203`) or scope it out.
  - **Evidence:** axe findings.md §top-issues; code refs above.

### Major

- **2 — [Consistency/Governance] Orphaned legacy component surface (~20 files) with one contract-violating copy**
  - **Observation:** exported-but-unimported components: workstation {Hero, DoctorChecks, ProvisioningSection, LayersSection, LayerCard, StackDiagram, **EcosystemDiagram**, ToolkitRationale, ThinWorkstationBadge}, toolkit {Hero, Overview, CapabilityAnatomy, DistributionMap, QueueSeparation, SwarmStory}, six per-feature `Hero.astro`, entire `features/landing`. The workstation `EcosystemDiagram` copy violates _every_ clause of the diagram contract (no aria-hidden / radio / status).
  - **Impact:** one accidental import ships a non-compliant diagram; barrels rot; reviewers audit ghosts.
  - **Effort:** S–M · **Severity:** Major · **Confidence:** High
  - **Fix:** delete both `EcosystemDiagram` copies + prune orphan exports (knip already flags duplicates); keep history via git.
  - **Evidence:** structural-map §gaps(a); content-seo-findings F6.

- **3 — [Compliance] Toolkit nexus lacks the contract-mandated keyboard/pointer convergence tests**
  - **Observation:** `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md:70-77` requires radio/keyboard/pointer sync for _every_ adoption; CapabilityNexus ships only a status-announcement assertion.
  - **Impact:** the largest interactive diagram on the site can silently regress its a11y grammar.
  - **Effort:** M · **Severity:** Major · **Confidence:** High
  - **Fix:** parameterize existing pr6 spec fixture for the nexus.
  - **Evidence:** content-seo-findings F7.

- **4 — [A11y risk] Unverified contrast cluster on dark surfaces (~465 nodes flagged incomplete across 15 combos)**
  - **Observation:** axe cannot evaluate SVG `<text>` fills (`#67e8f9` chassis labels, palette indices) nor gradient chrome hero text (`.hero__name-line.chrome-text`); V-page notes (`.v-scene__note`) and toolkit copy/state labels form the biggest cluster.
  - **Impact:** potential real AA failures invisible to CI (Lighthouse samples differently); muted-on-midnight body text is the usual offender.
  - **Effort:** M · **Severity:** Major (risk) · **Confidence:** Medium
  - **Fix:** scripted contrast probe (computed styles incl. SVG fills + effective gradient stops) → fix failures by raising text tones one ramp step; record results as the manual evidence.
  - **Evidence:** axe findings.md items 3–8.

- **5 — [Retracted — false positive] "Landmark inconsistency"** — removed after verification: every route renders `<header>`/`<footer>` via `SectionLayout` → `SiteHeader`/`SiteFooter`. The earlier axe-side structural note was incorrect; no change required.

### Minor

- **6 — Sitemap format/name mismatch** — `sitemap-index.xml` served a flat URL set under an index filename; renamed to `sitemap.xml`. (content-seo-findings F5) · Effort S
- **7 — Latent i18n leak + date drift** — Spanish-language placeholder text in two _unused_ Hero components; raw ISO dates on projects vs localized “Aug 7, 2026” on blog. (F9/F10) · Effort S
- **8 — Meta descriptions below own target** — blog/open-source/create-awesome at 59–66 chars vs the 120–160 ideal declared in `src/data/routes.ts`; schema doesn’t enforce. (F3) · Effort S
- **9 — External link rel hygiene** — 31 anchors use `noreferrer` without `noopener` (functionally safe; normalize convention). (flows Minor-1) · Effort S
- **10 — Scrubber accessible names concatenate** (“00Wallpaper”) — index span + title in `StageScrubber.astro`; add `aria-label="Stage N of M: <title>"`. (flows Minor-2) · Effort S
- **11 — Reduced-motion Play button gives zero feedback** — silent no-op feels broken; add one-line status or disabled styling. (flows Minor-3) · Effort S

### Not assessed (missing evidence)

| Indicator                         | Reason                                                    | What would enable assessment           |
| --------------------------------- | --------------------------------------------------------- | -------------------------------------- |
| Contrast on gradient/clipped text | Automated probe excludes transparent gradient text        | Manual visual contrast sampling        |
| Real screen-reader behavior       | No NVDA/VoiceOver/TalkBack run                            | Manual pilot using the checklist below |
| Real browser zoom behavior        | Automated 320px and 640px-equivalent checks pass          | Manual 200%/400% zoom pass             |
| Product/visitor validation        | No representative visitor study or Blog decision recorded | Owner/product review                   |
| Subjective visual/brand sign-off  | Vision tooling unavailable in this harness                | Owner review of production captures    |

---

## Roadmap

| Priority                | Item                                                                                                                    | Effort | Source                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------- |
| **Complete**            | Findings 1–11 · dead-code/CSS pruning · nexus convergence · contrast probe/fix · reflow · mobile snapshots · budgets/CI | S–M    | PRs #347, #348, #350, #351, #352, #353 |
| **Human gate**          | NVDA/VoiceOver/TalkBack, gradient contrast, and real browser-zoom pilot using `uiux-manual-qa-checklist.md`             | —      | owner                                  |
| **Product/design gate** | Visitor testing, empty Blog/navigation decision, visual/brand sign-off, and production feedback review                  | —      | owner                                  |

---

## Output handshake

- **Destination:** this file (`docs/design/current/uiux-assessment-2026-08.md`) via PR to `main`.
- **Reviewer:** Ulises Jeremias (owner) approves before any roadmap item becomes work.
- **Status:** automated assessment and implementation complete; human review gates remain explicitly listed above.
