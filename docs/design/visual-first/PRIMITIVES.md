# Visual-first primitives

Extracted from the Agent Toolkit Operations Room after gate **APPROVED** (2026-08-09).  
Location: `src/shared/components/visual/` · helper: `src/shared/lib/visual-stage-player.ts` · styles: `visual.css`.

These are **small composition pieces**, not a framework. Prefer copying a Toolkit teaching pattern over inventing new abstractions.

| Primitive          | Role                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `VisualNode`       | Selectable chip/button for map stations / families                  |
| `FlowPath`         | SVG path with optional active dash motion (respects reduced motion) |
| `SceneInspector`   | Side panel for the selected node (title + body + meta slot)         |
| `StageScrubber`    | Ordered stage buttons (`data-stage-index`)                          |
| `PlaybackControls` | Play / Pause / Prev / Next / Replay                                 |
| `StatusMeter`      | Circular percent meter                                              |
| `WorldDock`        | Compact CTA / install dock (not a card grid)                        |

## Client helper

`initStagePlayer({ root, stageCount, onStage, autoplayOnce })` wires scrubber + playback. Worlds pass domain-specific `onStage` to update SVG/inspector.

## Usage rules

1. One primary teaching device per concept.
2. Default-visible copy stays short; deep facts go in `<details>` or docs links.
3. Import CSS once per page/feature: `import '@/shared/components/visual/visual.css'`.
4. Do not add Three.js / GSAP / global React for these surfaces.
5. Keyboard: 44px targets, `aria-pressed`, arrow keys where tabs/radios apply.

## Source pattern

Toolkit references: `CapabilityNexus` (select + inspector), `SwarmControlRoom` (scrubber + playback + status), `InstallConsole` / `ProvenanceStrip` (compact docks — still feature-local until a second consumer needs a generic install console).
