# Content reduction tracker — visual-first pass

Measurement method: approximate visible words excluding site header/footer, `aria-hidden`, and closed `<details>` (Playwright evaluate). Canonical before numbers: production audit `audit/_metrics.json` / `AUDIT.md` (2026-08-09). After numbers: local `dist/` preview via `scripts/vf-measure-qa.mjs` → `qa/_metrics.json`.

## Site-wide BEFORE → AFTER

| Route                  | Before words | After words |    Δ % | Target band    | Result          |
| ---------------------- | -----------: | ----------: | -----: | -------------- | --------------- |
| `/`                    |          381 |         349 |  −8.4% | density polish | Met             |
| `/dotfiles`            |         1093 |         283 | −74.1% | −40% to −60%   | Exceeds         |
| `/agentic-workstation` |         2274 |         182 | −92.0% | −60% to −75%   | Exceeds         |
| `/agent-toolkit`       |         1662 |         338 | −79.7% | −60% to −75%   | Exceeds (gated) |
| `/v`                   |         2207 |         290 | −86.9% | −50% to −70%   | Exceeds         |
| `/create-awesome`      |         2169 |         198 | −90.9% | −55% to −70%   | Exceeds         |
| `/community`           |         1515 |         233 | −84.6% | −50% to −65%   | Exceeds         |
| `/blog`                |           51 |          19 | −62.7% | light polish   | Met             |
| `/projects`            |          366 |         207 | −43.4% | −30% to −50%   | Met             |
| `/open-source`         |          226 |          70 | −69.0% | −50% to −70%   | Met             |
| `/404.html`            |           28 |          28 |   0.0% | unchanged      | Met             |

## Per-route notes

### Agent Toolkit (gate APPROVED 2026-08-09)

Operations Room: Capability Nexus, Queue vs Swarm, Swarm Control Room, Install console, Provenance strip. Details: `toolkit-gate/WORD-COUNT.md`.

### Agentic Workstation

Single **Boot the Workstation** system map replaces Atlas + Stack + Ecosystem + Layers card walls. Profile selector, boot scrubber, health console, WorldDock.

### Dotfiles

Desktop hero, compact install, 3 principles, layers SVG + inspector, one Smart Colors pipeline, immersive gallery, attribution in details.

### V

`VComputationalLab` — selectable stations; diagram-on-select; licenses in details.

### Create Awesome

Assembly line world around Composer; compare/distribute/contribute folded into details.

### Community

`CommunityPlaza` — project nodes + inspector; single Discord CTA; basics collapsed.

### Projects / Open Source / Blog / Home

Archipelago + compact ledger; constellation + subtle verified date; shorter empty desk; About ~2 sentences + featured ledger polish.
