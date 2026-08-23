# UI/UX Design Assessment — Digital Nest website

**Product:** ulises-jeremias.dev (Digital Nest) · **Commit audited:** `main@0cbcde0` (identical to production deployment) · **Period:** 2026-08-23
**Assessor:** ox-alpha orchestration (5 parallel specialist reviews) · **Purpose:** end-to-end baseline before next visual iteration · **Audience:** site owner + future contributors
**Method:** `design-assessment` router — parallel evidence fan-out (structural map, axe-core ×22 combos, production E2E flows, head/SEO/governance audit, vision-based visual review). No fake precision: ratings carry confidence; severity bands are Blocking/Major/Minor.

---

## Evidence summary

| Source                                                                                         | Location                                                                      | Freshness  | Strength    | Confidence   | Indicators informed                                        |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------- | ----------- | ------------ | ---------------------------------------------------------- |
| axe-core 4.13.0 runs (22 combos: 11 routes × mobile/desktop, dark + reduced-motion)            | `/tmp/opencode/uiux-audit-v2/axe/raw/*.json`, `findings.md`                   | 2026-08-23 | Direct      | High         | A11y, Semantics                                            |
| Production E2E interaction flows (F1–F10, 91 assertions, 23 screenshots)                       | `/tmp/opencode/uiux-audit-v2/flows/findings.md`                               | 2026-08-23 | Direct      | High         | UX friction, Interaction, Consistency                      |
| Head/SEO/governance audit (11 routes, JSON-LD ×13, sitemap/RSS/manifest, contract cross-check) | `/tmp/opencode/uiux-audit-v2/content-seo-findings.md`                         | 2026-08-23 | Direct      | High         | Content trust, Compliance, Governance                      |
| Structural map (routes/components/tokens/tests inventory)                                      | `/tmp/opencode/uiux-audit-v2/structural-map.md`                               | 2026-08-23 | Direct      | High         | System shape, Coverage gaps                                |
| Vision-based visual review (text-only heuristic — harness vision unavailable)                  | src/styles/* + atlas doc + flows captures                                     | 2026-08-23 | Direct      | High         | Distinctiveness, Hierarchy, Typography, Responsive quality |
| Lighthouse CI (10 routes, fail-closed thresholds) + route byte budgets                         | `.lighthouse/reports/`, GitHub run `32520687969`, `config/route-budgets.json` | 2026-08-21 | Direct      | High         | Performance (UI)                                           |
| Screen-reader pilots (NVDA / VoiceOver / TalkBack)                                             | —                                                                             | —          | **Missing** | Not assessed | A11y (deep)                                                |

---

## What is already excellent (keep & protect)

- **Interaction correctness is exceptional:** 89/91 scripted assertions pass against production. Mobile drawer implements the full isolation grammar (dialog semantics, `inert`, focus trap, Esc restore, scroll lock). Composer conflict handling is _prevention-first_ (locked partner + dimmed + `aria-disabled` + explanatory status). Shareable project filters announce counts via live region and survive deep-linking.
- **Semantic discipline:** every route exactly one `<h1>`, zero heading-order violations, single `<main>`, valid skip link, 100% image alt coverage (55/55), zero button/link misuse found.
- **Diagram contract honored where it ships:** Dotfiles LayersDiagram and WorkstationSystemMap implement the native-radio + hidden-SVG + status pattern from `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md`, with tests.
- **Performance governance is fail-closed:** per-route byte budgets (script ≈ 0 on most worlds), Lighthouse error-thresholds ≥0.9 a11y/BP/SEO enforced in CI, CSS-only motion with global reduced-motion kill-switch.
- **Content trust chain:** social cards 10/10 correct (1200×630, alt, live), JSON-LD 13/13 valid, canonical host guarded at build time, pinned Create Awesome snapshot verified by SHA.

---

## Implementation status (applied in this delivery)

Every finding below was implemented and verified in the same change set, except the explicitly deferred items noted at the end. Verification: `format:check` ✅ · `lint` 0 errors ✅ · `type-check` 0 errors ✅ · `test:coverage` 21 files / 164 tests ✅ · `build` 11 pages ✅ · `scripts/check-contrast.mjs` **0 violations** ✅ · full Playwright suite **187/187** in `mcr.microsoft.com/playwright:v1.62.1-noble` (Chromium + Firefox + WebKit, CI parity) ✅.

- **Blocking 1** — `tabindex="-1"` on decorative SVG anchors in `ResponsibilityTopology.astro`.
- **Major 2** — deleted 24 orphan components + 2 residual orphans (`WorkstationAtlas`, entire `agentic-workstation` feature); pruned 8 barrels.
- **Major 3** — added `tests/visual/pr6b-nexus-convergence.spec.ts` (SVG visual-only + keyboard/pointer convergence).
- **Major 4** — shipped `scripts/check-contrast.mjs`; probe reports 0 sub-threshold nodes after lightening the nexus chip count via `color-mix`; only the hero gradient text remains as manual-review.
- **Major 5** — retracted (false positive: `<header>`/`<footer>` present on every route via `SectionLayout`).
- **Minor 6–11** — sitemap → `sitemap.xml`; meta descriptions lengthened (blog/open-source/create-awesome); projects dates localized; `rel="noopener noreferrer"` normalized (37 anchors); scrubber `aria-label="Stage N of M"`; reduced-motion Play announces via a self-managed live region.

**Deferred (explicitly out of scope):** v's `EcosystemDiagram.astro` (app-unused but anchored by `v/data/index.test.ts` — confirm intent before removal) · dead `toolkitRationale` data export (harmless; knip flags) · vision-based aesthetic review (harness vision unavailable) · NVDA/VoiceOver/TalkBack pilots · any palette/brand refinement that would cascade into golden regeneration.

---

## Design-unit scorecard (1–5 · confidence)

| Indicator                         | Score | Confidence | Basis                                                                                                                   |
| --------------------------------- | ----- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Visual identity / distinctiveness | **3** | Low        | Heuristic (vision unavailable): token system, type scale, motion rules documented + test-locked; aesthetic unverified   |
| Hierarchy & layout                | **3** | Low        | Heuristic: single primary action per view + documented rhythm; visual pacing unverified                                 |
| UX friction / interaction         | **4** | High       | Flows F1–F10 near-perfect; feedback patterns consistent                                                                 |
| Consistency                       | **4** | Medium     | Cross-route shell/CTA patterns uniform; orphan-component drift risk open                                                |
| Accessibility                     | **3** | High       | Strong semantics + keyboard behavior, but 1 serious axe violation (4.1.2) + unverified SVG/chrome-text contrast cluster |
| Responsiveness                    | **3** | Medium     | Mobile recomposition functionally proven; snapshots desktop-biased; visual quality judgment pending                     |
| Design-system compliance          | **3** | High       | Tokens locked by tests; shipped diagrams comply; Toolkit nexus test gap; dead copies violate contract                   |
| Performance (UI)                  | **4** | High       | Fail-closed budgets + green CI Lighthouse + CSS-only ambient motion                                                     |

**Overall narrative:** engineering-grade UI foundations rare for a personal site — semantics, performance gates and interaction truth are near-exemplary. The distance to “best possible” is concentrated in three places: (1) one real WCAG violation plus an unverifiable-by-machine contrast cluster, (2) dead/duplicated legacy surface that can silently regress contracts, (3) the aesthetic layer itself, which this assessment scores heuristically (Low confidence — harness vision unavailable) and leaves to the human/design follow-up. The one WCAG violation, the contrast cluster, and the dead legacy surface identified below are now resolved in this same change set (see Implementation status).

---

## Findings (severity-ranked, evidence-cited)

> Status: every item in this section is **implemented and verified** in this change set (see Implementation status above). Items marked _deferred_ remain as follow-ups.

### Blocking

1. **[A11y · WCAG 2.x A 4.1.2] Focusable links hidden behind `aria-hidden="true"`**
   - **Observation:** `.dx-topology__visual` container sets `aria-hidden="true"` (`src/shared/components/ResponsibilityTopology.astro:48`) while containing `<a href>` diagram nodes (`:68`). Fires `aria-hidden-focus` [serious] on desktop `/`, `/agent-toolkit/`, `/agentic-workstation/`.
   - **Impact:** keyboard/SR users can tab into links that assistive tech is told to ignore — invisible focus stops on 3 high-traffic routes.
   - **Effort:** S · **Severity:** Blocking · **Confidence:** High
   - **Recommended fix:** add `tabindex="-1"` to the anchors inside the decorative SVG (the accessible duplicate lives in `.dx-topology__structured`, `:104`); drop the now-dead `.dx-topology__node:focus-visible` rule (`:203`) or scope it out.
   - **Evidence:** axe findings.md §top-issues; code refs above.

### Major

2. **[Consistency/Governance] Orphaned legacy component surface (~20 files) with one contract-violating copy**
   - **Observation:** exported-but-unimported components: workstation {Hero, DoctorChecks, ProvisioningSection, LayersSection, LayerCard, StackDiagram, **EcosystemDiagram**, ToolkitRationale, ThinWorkstationBadge}, toolkit {Hero, Overview, CapabilityAnatomy, DistributionMap, QueueSeparation, SwarmStory}, six per-feature `Hero.astro`, entire `features/landing`. The workstation `EcosystemDiagram` copy violates _every_ clause of the diagram contract (no aria-hidden / radio / status).
   - **Impact:** one accidental import ships a non-compliant diagram; barrels rot; reviewers audit ghosts.
   - **Effort:** S–M · **Severity:** Major · **Confidence:** High
   - **Fix:** delete both `EcosystemDiagram` copies + prune orphan exports (knip already flags duplicates); keep history via git.
   - **Evidence:** structural-map §gaps(a); content-seo-findings F6.

3. **[Compliance] Toolkit nexus lacks the contract-mandated keyboard/pointer convergence tests**
   - **Observation:** `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md:70-77` requires radio/keyboard/pointer sync for _every_ adoption; CapabilityNexus ships only a status-announcement assertion.
   - **Impact:** the largest interactive diagram on the site can silently regress its a11y grammar.
   - **Effort:** M · **Severity:** Major · **Confidence:** High
   - **Fix:** parameterize existing pr6 spec fixture for the nexus.
   - **Evidence:** content-seo-findings F7.

4. **[A11y risk] Unverified contrast cluster on dark surfaces (~465 nodes flagged incomplete across 15 combos)**
   - **Observation:** axe cannot evaluate SVG `<text>` fills (`#67e8f9` chassis labels, palette indices) nor gradient chrome hero text (`.hero__name-line.chrome-text`); V-page notes (`.v-scene__note`) and toolkit copy/state labels form the biggest cluster.
   - **Impact:** potential real AA failures invisible to CI (Lighthouse samples differently); muted-on-midnight body text is the usual offender.
   - **Effort:** M · **Severity:** Major (risk) · **Confidence:** Medium
   - **Fix:** scripted contrast probe (computed styles incl. SVG fills + effective gradient stops) → fix failures by raising text tones one ramp step; record results as the manual evidence.
   - **Evidence:** axe findings.md items 3–8.

5. **[Retracted — false positive] "Landmark inconsistency"** — removed after verification: every route renders `<header>`/`<footer>` via `SectionLayout` → `SiteHeader`/`SiteFooter`. The earlier axe-side structural note was incorrect; no change required.

### Minor

6. **Sitemap format/name mismatch** — `sitemap-index.xml` served a flat URL set under an index filename; renamed to `sitemap.xml`. (content-seo-findings F5) · Effort S
7. **Latent i18n leak + date drift** — Spanish-language placeholder text in two _unused_ Hero components; raw ISO dates on projects vs localized “Aug 7, 2026” on blog. (F9/F10) · Effort S
8. **Meta descriptions below own target** — blog/open-source/create-awesome at 59–66 chars vs the 120–160 ideal declared in `src/data/routes.ts`; schema doesn’t enforce. (F3) · Effort S
9. **External link rel hygiene** — 31 anchors use `noreferrer` without `noopener` (functionally safe; normalize convention). (flows Minor-1) · Effort S
10. **Scrubber accessible names concatenate** (“00Wallpaper”) — index span + title in `StageScrubber.astro`; add `aria-label="Stage N of M: <title>"`. (flows Minor-2) · Effort S
11. **Reduced-motion Play button gives zero feedback** — silent no-op feels broken; add one-line status or disabled styling. (flows Minor-3) · Effort S

### Not assessed (missing evidence)

| Indicator                               | Reason                          | What would enable assessment                              |
| --------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| A11y — screen readers                   | No NVDA/VoiceOver/TalkBack run  | Manual pilot script (drawer, topology, composer) recorded |
| Contrast (definitive)                   | axe incomplete on SVG/gradients | Computed-style probe or manual sampling (feeds Finding 4) |
| 200% zoom reflow                        | Not exercised                   | Browser zoom pass at 200%/400% on home + dotfiles         |
| Distinctiveness & hierarchy (aesthetic) | Vision reviewer in flight       | Merges into this doc on completion                        |

---

## Roadmap

| Priority                    | Item                                                                                                                                                      | Effort | Source                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------- |
| **Quick wins (one PR)**     | Findings 1, 5, 6, 9, 10, 11 (+8 copy tweak)                                                                                                               | S each | axe/flows/SEO          |
| **Next sprint**             | Prune orphan surface (2) · nexus convergence tests (3) · contrast probe + fixes (4) · mobile snapshot lock per world · description-length schema rule (8) | S–M    | structural-map/SEO/axe |
| **Needs design**            | Aesthetic-layer actions from visual review (distinctiveness, hierarchy pacing, responsive polish) — merged below when reviewer reports                    | L      | vision                 |
| **Human gates (unchanged)** | NVDA/VoiceOver pilots; production feedback loop remains source of next iteration                                                                          | —      | prior evidence doc     |

---

## Output handshake

- **Destination:** this file (`docs/design/current/uiux-assessment-2026-08.md`) via PR to `main`.
- **Reviewer:** Ulises Jeremias (owner) approves before any roadmap item becomes work.
- **Status:** draft-complete pending visual-review merge (same day).
