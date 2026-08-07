# ZIP vs production — fidelity gap log

Date: 2026-08-07 · Branch: `design/synthwave-zip-fidelity`

## Closed

| Gap                                               | Resolution                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| System UI fonts vs Orbitron/JetBrains             | Self-hosted OFL WOFF2 + `fonts.css`                              |
| Flat CSS atmosphere vs ZIP hero plate             | `hero-bg.webp` plate + scanlines/veil + CSS reinforcement        |
| SVG-only world glyphs vs island mini-environments | ZIP `island-*.webp` on layered platforms with `art-fade`         |
| Missing terminal quote                            | Neon-frame quote with verified positioning statement             |
| Identity order (wordmark before name)             | Huge chrome name → DIGITAL NEST divider → bio → keywords → CTAs  |
| Soft panels vs neon-frame evidence                | Status / About / Projects use ZIP neon-frame + corner accents    |
| Fake ZIP metrics/stars/portrait                   | Verified nest status (9 worlds, 61/16/10/7, 22 rices); no avatar |
| Shell logo / footer bar                           | Nest logo asset + compact neon footer shell                      |
| Light paper routes                                | Migrated workstation/v/community/etc. to midnight/world tokens   |
| Mobile shrink                                     | Vertical connected path with spine (not 3-col shrink)            |

## Remaining limitations

- ZIP Next.js cards are adapted to floating platforms (intentional — product principle).
- Island art uses screen/`art-fade` blend; very dark island edges can soft-fade into the plate.
- Some route interior diagrams still use diagram-local navy fills (already dark, not paper).
- Legacy `--theme-*` light-paper tint contracts remain for design-system compatibility; dark UIs use `--world-*`.
- Blog content collection is empty (pre-existing); no Spanish stubs found in pages.
