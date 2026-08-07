# ZIP vs production — fidelity gap closure (2026-08-07)

## ZIP contained

Next.js / v0 mockup with Orbitron + JetBrains Mono, oklch magenta/cyan dark theme, hero plate (`hero-bg.png`), nine island PNGs, logo, neon-frame panels, dashed constellation SVG, terminal quote, status/about/projects panels, compact neon footer.

## Gaps closed

| Gap                                | Resolution                                               |
| ---------------------------------- | -------------------------------------------------------- |
| System fonts vs Orbitron/JetBrains | Self-hosted WOFF2 + `fonts.css`                          |
| Flat CSS sun only                  | ZIP `hero-bg.webp` plate + scanlines + CSS reinforcement |
| SVG-only world icons               | ZIP island WebP on layered platforms + underglow         |
| Missing terminal quote             | Verified positioning quote in neon frame                 |
| Identity order / chrome name       | Huge Orbitron chrome name → DIGITAL NEST divider → CTAs  |
| Soft evidence panels               | Neon-frame / clip-corner status · about · ledger         |
| Header mark                        | `logo-nest.webp` + magenta Orbitron wordmark             |
| Footer shell                       | Compact neon bar + atlas index + verified socials        |
| Fake ZIP metrics/portrait          | Not shipped; verified toolkit/rices/status data only     |
| Light route paper surfaces         | Migrated to midnight/world tokens                        |
| Screenshots                        | `docs/design/final/2026-08-07-zip/` @ 1440 + 390         |

## Remaining limitations

- Island art uses screen/`art-fade` blend; on some displays islands read softer than ZIP cards.
- Atlas scatter is platform-first (not ZIP’s strict 3-column card grid) by design brief.
- Legacy `--theme-*` light roles remain for design-system contract; dark `--world-*` drive production.
- ZIP avatar / invented stars / commit counts intentionally omitted.
