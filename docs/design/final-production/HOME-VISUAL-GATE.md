# Homepage visual gate — SHIP AUTHORIZED / FORMAL REVIEW OPEN

**Branch:** `feat/final-digital-nest-production`  
**Base:** `f05db66` (`main` / #322 ZIP fidelity)  
**Status:** Product owner authorized merge to `main` without blocking on this gate. Golden Playwright snapshots intentionally **not** updated for this ship. Formal APPROVED / REJECTED reply still welcome for golden refresh and #319 acceptance.

## Comparison package

| Artifact                  | Path                                                                         |
| ------------------------- | ---------------------------------------------------------------------------- |
| Reference                 | `docs/design/final-production/reference-comparison/reference.png`            |
| Production before (crawl) | `docs/design/final-production/audit/home/1440.png` · `390.png`               |
| Candidate 1440            | `docs/design/final-production/reference-comparison/home-desktop.png`         |
| Candidate 390             | `docs/design/final-production/reference-comparison/home-mobile.png`          |
| Side-by-side              | `docs/design/final-production/reference-comparison/reference-vs-desktop.png` |

## What changed in Wave 1

- Project worlds rebuilt from framed ~88px card thumbnails to **illustration-first floating dioramas** (~144–216px art) with **label plates above** the platform (art is not inside the card frame).
- Underglow + drop shadow on platforms; staggered rise/mid/drop retained on desktop.
- Homepage order matches reference: Dotfiles → **Agent Toolkit** → Agentic Workstation → …
- Mobile: alternating left/right vertical journey with large islands (below first viewport).
- Hero summary no longer triple-repeats “Solutions Architect”.

## Wave 0 factual fixes already on this branch

- `#galeria` → `#gallery`
- Spanish `Diagrama de capas` / `4 capas` → English
- Removed public `Epic G`
- CVA domain → `create-awesome-vlang-app.vercel.app`
- Community template → `react-vite-boilerplate`
- Removed fake Create Awesome `archived` pointer from projects ledger

## Ask

Please review the comparison package and reply with one of:

1. **APPROVED** — proceed to Wave 2 (shared world layout) and onward
2. **APPROVED WITH NOTES** — list adjustments; I will patch home before propagating
3. **REJECTED** — describe the gap vs reference; I will rebuild Wave 1

Do **not** treat this as production-ready until you sign off.
