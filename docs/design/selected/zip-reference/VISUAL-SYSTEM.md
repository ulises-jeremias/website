# Digital Nest ZIP — Visual System (source of truth)

Ingested from `digital-nest-portfolio.zip` (Next.js / v0 mockup) on 2026-08-07.

## Package contents

| Area               | Files                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Shell              | `components/site-header.tsx`, `site-footer.tsx`                    |
| Hero               | `components/hero.tsx`, `project-worlds.tsx`                        |
| Panels             | `status-panel.tsx`, `about-panel.tsx`, `recent-projects.tsx`       |
| Tokens             | `app/globals.css` (oklch magenta/cyan dark theme)                  |
| Art                | `public/assets/hero-bg.png`, `island-*.png`, `logo-nest.png`       |
| Fake (do not ship) | `avatar.png`, invented stars/metrics/commits, placeholder portrait |

## Exact visual system

### Color

- Background: deep violet-black (`oklch(0.14 0.055 300)` ≈ `#0d0619`)
- Primary (magenta): `oklch(0.7 0.27 340)`
- Accent (cyan): `oklch(0.82 0.16 200)`
- Surfaces: translucent card with magenta border + inset glow (`neon-frame`)
- Selection: primary on primary-foreground

Mapped into Digital Nest tokens as `--nest-midnight-*`, `--nest-magenta`, `--nest-cyan`.

### Typography

- Display: **Orbitron** (black, uppercase) for identity and section labels
- Body / UI: **JetBrains Mono** for technical framing and chrome labels
- Hierarchy: huge chrome name → `DIGITAL NEST` divider → positioning → keywords → CTAs

### Layout (desktop ~1400px)

1. Immersive hero plate (`hero-bg`) with scanlines + left-to-right readability gradient
2. Header inside the hero shell (logo + nav + utility icons)
3. Asymmetric stage: identity (left ~0.85) / project worlds (right ~1.15)
4. Terminal quote floating top-right of the atlas
5. Lower evidence row: status · about · projects (3 neon panels)
6. Compact neon-frame footer bar

### Project worlds

ZIP ships neon-frame “cards” with island art. Production adaptation:

- Keep **floating layered platforms + underglow** (not generic icon cards)
- Use original ZIP island WebP art with `art-fade` / screen blend
- Keep dashed constellation SVG network
- Mobile: vertical connected path, not a shrunk 3-column grid

### Atmosphere

- Striped sunset sun, perspective magenta grid, mountains + cyber skyline
- Hero plate provides palms / city / constellation art from the ZIP
- Scanline flicker + slow float on worlds (disabled under `prefers-reduced-motion`)

### Motion

- `flicker` on scanlines, `float-slow` on worlds, dashed stroke `dash` on connections
- Hover: lift + stronger neon; focus: visible ring + glow

### Data policy

Ship ZIP composition and art. **Never** ship ZIP mock metrics, stars, activity sparklines, or generated portrait.

## Source archive

Original Next.js mockup sources were inspected from `digital-nest-portfolio.zip` and are **not** vendored as lintable TypeScript in this repo. Production adapts composition and art into Astro modules under `src/features/home/` and shared shell components.
