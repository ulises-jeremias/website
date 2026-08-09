# Full visual-first pass — visible word counts

Method: Playwright evaluation of default-visible text excluding site chrome, `aria-hidden`, and closed `<details>`.  
Before: production audit `docs/design/visual-first/audit/_metrics.json` (2026-08-09).  
After: local build measured into `docs/design/visual-first/qa/_after-metrics.json`.

| Route                  | Before | After | Δ words |    Δ % |
| ---------------------- | -----: | ----: | ------: | -----: |
| `/`                    |    381 |   349 |     −32 |  −8.4% |
| `/dotfiles`            |   1093 |   283 |    −810 | −74.1% |
| `/agentic-workstation` |   2274 |   182 |   −2092 | −92.0% |
| `/agent-toolkit`       |   1662 |   338 |   −1324 | −79.7% |
| `/v`                   |   2207 |   290 |   −1917 | −86.9% |
| `/create-awesome`      |   2169 |   198 |   −1971 | −90.9% |
| `/community`           |   1515 |   233 |   −1282 | −84.6% |
| `/blog`                |     51 |    19 |     −32 | −62.7% |
| `/projects`            |    366 |   207 |    −159 | −43.4% |
| `/open-source`         |    226 |    70 |    −156 | −69.0% |
| `/404.html`            |     28 |    28 |       0 |     0% |

Script: `scripts/vf-measure-all.mjs`.
