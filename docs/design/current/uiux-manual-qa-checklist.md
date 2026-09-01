# UI/UX Manual QA Checklist

**Site:** `https://www.ulises-jeremias.dev`
**Target:** WCAG 2.2 AA and final visual/brand sign-off
**Automated baseline:** current `main` (browser-quality CI: axe on 14 routes, critical navigation, reflow, reduced-motion, no-JS fallbacks, cross-browser smoke, route budgets, Lighthouse CI)
**Owner:** Ulises Jeremias
**Status:** #295 — automated evidence complete; all manual rows below remain PENDING MANUAL until executed on real devices. Automated checks (axe, Lighthouse, Playwright) are **not** substitutes for screen-reader or hardware testing.

This checklist covers the evidence that browser automation cannot reliably replace. Record the date, browser version, assistive technology version, viewport, and any reproduction URL beside each finding. Use keyboard-only input for keyboard checks; use touch exploration and touch scrolling for TalkBack checks. Do not claim screen-reader acceptance until all applicable pilots are complete.

## Route coverage matrix (representative routes, current portfolio IA)

Routes: Home `/`, Work `/projects`, flagship detail `/dotfiles` (HorneroConfig), Agentic overview `/agentic`, Open Source `/open-source`.

| Check                                                     | Home                                                                    | Work                       | Flagship detail            | Agentic                    | Open Source                |
| --------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------- | -------------------------- | -------------------------- | -------------------------- |
| Skip link lands on `#main-content`                        | PASS (automated, critical-navigation)                                   | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| Landmarks + single H1                                     | PASS (automated)                                                        | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| axe WCAG 2.1 AA desktop+mobile, no critical/serious       | PASS (automated, #428)                                                  | PASS (automated, #428)     | PASS (automated, #428)     | PASS (automated, #428)     | PASS (automated, #428)     |
| Keyboard-only traversal (headings/landmarks/controls)     | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |
| Accessible names on all controls                          | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |
| SVG diagrams have text equivalents / are excluded from AT | PASS (automated, INTERACTIVE_DIAGRAM_SEMANTICS + pr6-diagram-semantics) | PENDING MANUAL             | PASS (automated)           | PENDING MANUAL             | PENDING MANUAL             |
| Reduced-motion: no permanently hidden content             | PASS (automated, reduced-motion.spec + scroll-reveal safety net #389)   | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| No-JS: nav, hierarchy, content, diagram text complete     | PASS (automated, no-JS suites)                                          | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| NVDA + Firefox full pilot                                 | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |
| VoiceOver + Safari full pilot (rotor, drawer `inert`)     | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |
| TalkBack + Chrome full pilot (touch exploration)          | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |
| 200% zoom, no 2-D scrolling                               | PASS (automated reflow at 200%-equivalent)                              | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| 400% zoom / 320px viewport                                | PASS (automated reflow 320px, all routes incl. #428)                    | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| Human visual zoom review (subjective)                     | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |
| Forced-colors emulation (focus visibility)                | PASS (automated, pr2-a11y)                                              | PASS (automated, pr2-a11y) | PASS (automated, pr2-a11y) | PASS (automated, pr2-a11y) | PASS (automated, pr2-a11y) |
| Mobile touch targets ≥ 44px / no hover-only               | PASS (automated, mobile-device-smoke + a11y rules)                      | PASS (automated)           | PASS (automated)           | PASS (automated)           | PASS (automated)           |
| Mobile touch exploration reaches every primary action     | PENDING MANUAL                                                          | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             | PENDING MANUAL             |

Statuses: **PASS** = verified by an automated suite or named test (never hand-asserted); **PENDING MANUAL** = requires the listed human/AT procedure; **NOT APPLICABLE** = none currently identified for these routes.

## Screen Reader Pilots

Run each pilot with a clean browser profile. Use keyboard-only input for keyboard checks; use touch exploration and touch scrolling for TalkBack checks. Verify that focus never lands on hidden content, status messages are concise, and the reading order matches the visible order.

### NVDA + Firefox

- [ ] Homepage: activate the skip link and confirm focus moves to `#main-content`.
- [ ] Homepage: navigate landmarks and headings; confirm one page heading and discoverable footer navigation.
- [ ] Mobile navigation: open Menu, confirm the drawer is announced as a dialog, background content is unavailable, Escape closes it, and focus returns to Menu.
- [ ] Dotfiles: use the native layer radios with Arrow keys; confirm selected layer, inspector, and status message stay synchronized.
- [ ] Workstation: use responsibility radios and boot controls; confirm the visual SVG does not enter the accessibility tree.
- [ ] Agent Toolkit: use capability-family radios with Arrow keys and labels; confirm the panel and status announcement update without moving focus.
- [ ] Create Awesome: move through runtime, template, and addon controls; confirm incompatible addons are announced when removed.
- [ ] Projects: type in the filter; confirm the result count is announced and the empty state explains the next action.
- [ ] Agent Toolkit and Swarm: focus each named horizontally scrollable CLI/code region and confirm its accessible name explains what can be scrolled.
- [ ] Dotfiles and Workstation: attempt to reach long command regions with the keyboard; record any region that lacks a focusable, named scroll surface as a follow-up.

### VoiceOver + Safari

- [ ] Repeat the NVDA flow checks, including rotor landmark/heading navigation.
- [ ] Verify drawer focus restoration and `inert` background behavior with VoiceOver interaction mode.
- [ ] Verify SVG diagrams are treated as visual reinforcement and the structured controls are read instead.
- [ ] Verify status messages do not repeat full inspector content.

### TalkBack + Chrome

- [ ] Repeat the skip link, mobile drawer, radio selection, composer, and project filter flows with touch exploration where applicable.
- [ ] Verify touch exploration reaches every visible primary action and does not enter decorative SVG content.
- [ ] Verify horizontal code regions can be reached and scrolled with a touch gesture and have an understandable label.

## Zoom And Reflow

- [ ] At 200% browser zoom on a 1280px-equivalent viewport, verify primary content remains readable without two-dimensional scrolling.
- [ ] At 400% browser zoom or a 320px CSS viewport, verify every route remains usable; automated reflow coverage currently passes all 11 routes.
- [ ] Verify the compact header can be horizontally navigated without clipping or obscuring the focused link.
- [ ] Verify long commands, captions, project summaries, and evidence notes wrap or scroll inside their intended containers.

## Visual And Brand Sign-Off

- [ ] Review Homepage at mobile, tablet, and desktop widths for hierarchy, pacing, and CTA prominence.
- [ ] Review every world page for consistent Atlas shell, typography, spacing, contrast, and accent semantics.
- [ ] Confirm the visible-content redesign feels scannable rather than merely longer after removing disclosures.
- [ ] Confirm the Synthwave Systems Atlas remains distinctive without glow noise reducing legibility.
- [ ] Confirm changed goldens represent the intended production baseline, not accidental browser drift.
- [ ] Record owner approval or concrete follow-up findings in the assessment document.

## Sign-Off Record

| Pilot/review        | Tester | Date | Viewport | Browser/AT | Result  | Evidence |
| ------------------- | ------ | ---- | -------- | ---------- | ------- | -------- |
| NVDA + Firefox      |        |      |          |            | Pending |          |
| VoiceOver + Safari  |        |      |          |            | Pending |          |
| TalkBack + Chrome   |        |      |          |            | Pending |          |
| Contrast sampling   |        |      |          |            | Pending |          |
| Zoom/reflow pilot   |        |      |          |            | Pending |          |
| Visual/brand review |        |      |          |            | Pending |          |
