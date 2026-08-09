# Agent Toolkit — visible word count

Method: Playwright evaluation of default-visible text in page body, excluding site chrome (header/footer), `aria-hidden`, and closed `<details>` content. Same method as production audit baseline.

| State                                       | Approx visible words | Source                                                           |
| ------------------------------------------- | -------------------: | ---------------------------------------------------------------- |
| **Before** (production 2026-08-09)          |             **1662** | `docs/design/visual-first/audit/_metrics.json` → `agent-toolkit` |
| **After** (local prototype, reduced-motion) |              **355** | preview measurement after Operations Room build                  |

## Delta

| Metric   | Value              |
| -------- | ------------------ |
| Absolute | −1307 words        |
| Relative | **−78.6%**         |
| Target   | −60% to −75%       |
| Result   | **Exceeds target** |

## Notes

- After count uses the Operations Room prototype on branch `feat/visual-first-agent-toolkit` via `pnpm build` + `pnpm preview`.
- Inactive family panels are `hidden` and excluded.
- “Inspect run state”, “Show CLI”, and provenance “Details” stay behind `<details>` and are excluded from default-visible count.
- Teaching surface increased (nexus, personas, queue/swarm split, control room scrubber) while default prose decreased.
