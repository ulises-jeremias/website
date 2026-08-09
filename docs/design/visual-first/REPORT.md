# Visual-first pass — REPORT

**Date:** 2026-08-09  
**Branch:** `feat/visual-first-agent-toolkit`  
**Parent epic:** #319 (OPEN — Refs, not Fixes)  
**Art direction:** Synthwave Systems Atlas (#52 closed — not reopened)  
**Toolkit gate:** APPROVED (chat 2026-08-09) → `toolkit-gate/GATE.md`  
**Final gate:** **PENDING PRODUCT REVIEW** → `final-gate/GATE.md`

---

## Principle

Website = interactive trailer / conceptual map.  
Repository + Wiki + docs/ = detailed manual.  
One concept = one primary teaching device.

Shared primitives = behavior / a11y / playback / focus / motion — **not** identical composition on every world.

## What shipped (candidate)

1. **Primitives** — `src/shared/components/visual/` + single `visual-stage-player` + `PRIMITIVES.md`
2. **Toolkit** — Operations Room (prior gate; pattern source)
3. **Workstation** — immersive boot / machine scene
4. **Dotfiles** — desktop + Smart Colors pipeline + gallery
5. **V** — station scenes with real interactions (no CSS-hiding essays)
6. **Create Awesome** — assembly line around Composer (progressive-enhancement safe)
7. **Community** — plaza with world clusters + one Community basics disclosure
8. **Projects / OSS / Blog / Home** — density polish + a11y fixes

Tech: Astro + CSS + SVG + native TS + WAAPI where present. No Three.js / GSAP-by-default / global React. No invented metrics / fake live telemetry. Playwright goldens **not** updated in this CHANGES REQUESTED pass (candidate evidence only).

## Measurement

Canonical helper: `scripts/lib/vf-visible-content.mjs`  
Excludes: header/footer chrome, `script` / `style` / `noscript`, `aria-hidden`, closed `<details>` bodies, non-visible CSS.

Word count is a **regression signal**, not an acceptance KPI.

See `CONTENT-REDUCTION.md` and `qa/_metrics.json` (regenerate via `scripts/vf-measure-qa.mjs` / `vf-measure-all.mjs` against local preview).

## Evidence paths

| Package           | Path                                                 |
| ----------------- | ---------------------------------------------------- |
| Production audit  | `docs/design/visual-first/AUDIT.md`                  |
| Audit screenshots | `docs/design/visual-first/audit/`                    |
| Toolkit gate      | `docs/design/visual-first/toolkit-gate/`             |
| Primitives doc    | `docs/design/visual-first/PRIMITIVES.md`             |
| Content table     | `docs/design/visual-first/CONTENT-REDUCTION.md`      |
| QA screenshots    | `docs/design/visual-first/qa/{route}/{1440,390}.png` |
| Final gate        | `docs/design/visual-first/final-gate/`               |

## Checks (required)

Record exact results before claiming green:

- `pnpm lint` / `pnpm format:check`
- `pnpm type-check`
- `pnpm test`
- `pnpm test:coverage` (when required by CI)
- `pnpm build`
- Visual: candidate captures only — **do not** run `test:visual:update` for accepted goldens in this pass

## Dependency status

No new runtime dependencies intended for this CHANGES REQUESTED pass. Verify `pnpm install` / lockfile unchanged unless a fix requires otherwise.

## Manual QA suggestions

- Keyboard: tab through Toolkit Nexus, Swarm scrubber, Workstation layers vs boot, Dotfiles gallery, CA composer runtimes (with JS disabled), Community interest filter, OSS constellation.
- Reduced motion: confirm autoplay once / stop / replay; no infinite attention-demanding beams.
- Blur-text test: each world still reads as a distinct metaphor with text blurred.
- Fake telemetry: no Boot health % / live budget % / live-looking handoff SHA without DEMO label.

## Deferred / known compromises

- Full immersive Workstation MACHINE scene and Toolkit agent SVG personas may still deepen after product notes.
- Playwright accepted goldens intentionally stale until APPROVED.
- #319 remains open for residual product sign-off.

## Explicit stop

**STOP for human product re-review.**  
Do not merge. Do not update accepted Playwright goldens. Do not close #319 / #86.  
Gate status: **PENDING PRODUCT REVIEW**.
