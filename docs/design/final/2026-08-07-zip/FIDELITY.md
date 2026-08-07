# ZIP vs production — fidelity gap closure (2026-08-07, updated ZIP)

## ZIP contained

Next.js / v0 mockup with Orbitron + JetBrains Mono, oklch magenta/cyan dark theme, metallic `chrome-text` hero title, hero plate (`hero-bg.png` at center 38%), nine island PNGs, logo, neon-frame panels, dashed constellation SVG, terminal quote, status/about/projects panels, compact neon footer.

## Gaps closed

| Gap                                | Resolution                                           |
| ---------------------------------- | ---------------------------------------------------- |
| System fonts vs Orbitron/JetBrains | Self-hosted WOFF2 + `fonts.css`                      |
| Flat CSS sun only                  | ZIP `hero-bg` plate (+ WebP) + scanlines + ZIP veil  |
| SVG-only world icons               | ZIP island PNGs/WebP on neon cards with `art-fade`   |
| Soft chrome name                   | Exact ZIP `chrome-text` metallic gradient            |
| Missing terminal quote             | Verified positioning quote in neon frame             |
| Soft evidence panels               | Neon-frame / clip-corner status · about · ledger     |
| Header mark                        | `logo-nest` PNG + WebP + magenta Orbitron wordmark   |
| Footer shell                       | Compact neon bar + atlas index + verified socials    |
| Fake ZIP metrics/portrait          | Not shipped; verified toolkit/rices/status data only |
| Screenshots                        | `docs/design/final/2026-08-07-zip/` @ 1440 + 390     |

## Assets synced from ZIP `public/`

| ZIP path                      | Repo path                                   |
| ----------------------------- | ------------------------------------------- |
| `public/assets/hero-bg.png`   | `public/assets/hero-bg.png` (+ nest WebP)   |
| `public/assets/logo-nest.png` | `public/assets/logo-nest.png` (+ nest WebP) |
| `public/assets/island-*.png`  | `public/assets/island-*.png` (+ nest WebP)  |

Avatar / placeholders intentionally not wired into UI.
