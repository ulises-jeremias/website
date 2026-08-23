# UI/UX Manual QA Checklist

**Site:** `https://www.ulises-jeremias.dev`
**Target:** WCAG 2.2 AA and final visual/brand sign-off
**Automated baseline:** `main@e8b561c5`
**Owner:** Ulises Jeremias

This checklist covers the evidence that browser automation cannot reliably replace. Record the date, browser version, assistive technology version, viewport, and any reproduction URL beside each finding. Use keyboard-only input for keyboard checks; use touch exploration and touch scrolling for TalkBack checks. Do not claim screen-reader acceptance until all applicable pilots are complete.

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
