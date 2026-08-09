# Content reduction tracker — visual-first pass

Measurement method: approximate visible words excluding site header/footer, `aria-hidden`, and closed `<details>` (Playwright evaluate). Canonical before numbers: `audit/_metrics.json`. Screenshots: `audit/{route}/{1440,390}.png`.

## Site-wide BEFORE (production 2026-08-09)

| Route                  | Before words | After words |        Δ % | Notes                                            |
| ---------------------- | -----------: | ----------: | ---------: | ------------------------------------------------ |
| `/`                    |          381 |         TBD |        TBD | Not in P0 prototype                              |
| `/dotfiles`            |         1093 |         TBD |        TBD | Not in P0 prototype                              |
| `/agentic-workstation` |         2274 |         TBD |        TBD | Not in P0 prototype                              |
| `/agent-toolkit`       |     **1662** |     **355** | **−78.6%** | P0 Operations Room — exceeds −60% to −75% target |
| `/v`                   |         2207 |         TBD |        TBD | Not in P0 prototype                              |
| `/create-awesome`      |         2169 |         TBD |        TBD | Not in P0 prototype                              |
| `/community`           |         1515 |         TBD |        TBD | Not in P0 prototype                              |
| `/blog`                |           51 |         TBD |        TBD | Likely unchanged                                 |
| `/projects`            |          366 |         TBD |        TBD | Likely minor                                     |
| `/open-source`         |          226 |         TBD |        TBD | Likely minor                                     |
| `/404.html`            |           28 |         TBD |        TBD | Unchanged                                        |

## Agent Toolkit

| Metric      | Value                        |
| ----------- | ---------------------------- |
| Before      | **1662**                     |
| After       | **355**                      |
| Absolute Δ  | −1307                        |
| Relative Δ  | **−78.6%**                   |
| Target band | 415–665 words (−60% to −75%) |
| Result      | **Exceeds target**           |

Details: `toolkit-gate/WORD-COUNT.md` · human gate: `toolkit-gate/GATE.md`.

Other routes: after numbers deferred until post-Toolkit human approval.
