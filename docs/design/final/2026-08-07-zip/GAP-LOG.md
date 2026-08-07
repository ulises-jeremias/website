# ZIP vs production — fidelity gap log

Date: 2026-08-07 · Branch: `design/synthwave-zip-fidelity` · Updated ZIP pass

## Closed (updated ZIP)

| Gap                             | Resolution                                                       |
| ------------------------------- | ---------------------------------------------------------------- |
| Missing metallic chrome title   | ZIP `chrome-text` oklch gradient on hero name                    |
| Hero plate framing              | `object-position: center 38%` + L→R veil `via 35% → transparent` |
| Competing CSS sun/mountains     | Atmosphere reduced to ZIP plate + veil + floor fade + scanlines  |
| Floating platforms vs ZIP cards | 3-column neon cards, staggered Y, ZIP constellation paths        |
| Optimized-only nest WebP        | ZIP PNGs at `/assets/*` + WebP derivatives under `/assets/nest/` |
| Compact mobile nav              | ZIP-style horizontal compact nav under header                    |
| Status sparkline visual         | Decorative wave (not shipped as live metrics)                    |

## Still intentionally omitted

- ZIP avatar portrait
- Invented commit counts / stars / coffee metrics
- Fake project star counts in Recent Projects

## Remaining limitations

- Island art uses screen/`art-fade` blend; dark edges can soft-fade into the plate.
- Legacy `--theme-*` light roles remain for design-system contract; dark `--world-*` drive production.
- Blog content collection is empty (pre-existing).
