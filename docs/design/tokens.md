# Design tokens — Digital Nest (Epic C · C-04 → C-08)

> Source of truth for the umbrella design system. Code implementation in `src/styles/`.
> WCAG 2.1 AA required for every text/background pair; failing pairs are **forbidden** and documented with alternatives.

## Files

| File                          | Purpose                                                                              | Issue |
| ----------------------------- | ------------------------------------------------------------------------------------ | ----- |
| `src/styles/tokens.css`       | 8 primitive brand colors + accessible derivatives, radius/shadow, spacing primitives | C-04  |
| `src/styles/semantic.css`     | Background/surface/text/border/accent/status/code/focus mappings, light + dark       | C-05  |
| `src/styles/typography.css`   | Scale, stacks, line-height ≥1.5, mono, measure, responsive steps, font-display       | C-07  |
| `src/styles/spacing.css`      | 4/8 scale, grid (12-col), breakpoints, containers, section rhythm, touch targets     | C-08  |
| `src/styles/themes/*.css`     | Per-section accent overrides with cohesion guardrails                                | C-06  |
| `src/styles/index.css`        | Entry point importing all above in correct order                                     | —     |
| `src/styles/themes/index.css` | Architecture doc + shared-vs-variable contract + scoping mechanism                   | C-06  |

## C-04 — Global color tokens

### Primitives (8 colors, exact hex)

| Token                | Hex       | RGB         | Use                                  | Notes   |
| -------------------- | --------- | ----------- | ------------------------------------ | ------- |
| `--color-warm-paper` | `#F7F0E6` | 247,240,230 | Main light background                | L 0.878 |
| `--color-warm-white` | `#FFFDF9` | 255,253,249 | Card / elevated surface              | L 0.984 |
| `--color-sand`       | `#E9D8C3` | 233,216,195 | Muted bg, border                     | L 0.704 |
| `--color-deep-ink`   | `#181512` | 24,21,18    | Body text on light; bg on dark       | L 0.008 |
| `--color-clay`       | `#B85C38` | 184,92,56   | Primary accent (decorative on light) | L 0.181 |
| `--color-copper`     | `#D99058` | 217,144,88  | Highlight (text only on dark)        | L 0.354 |
| `--color-cool-sky`   | `#7CB7C9` | 124,183,201 | Tertiary accent (text only on dark)  | L 0.424 |
| `--color-moss`       | `#6B715E` | 107,113,94  | Secondary accent                     | L 0.157 |

Primitives are defined once in `tokens.css`. No section may redefine them.

### Derived accessible variants

Because no mid-tone can be AA on both light (`Warm paper` requires L ≤ 0.156) and dark (`Deep ink` requires L ≥ 0.210) simultaneously, we ship separate variants.

| Token                     | Hex       | Ratio on `Warm paper` | Ratio on `Deep ink` | Purpose                                                                    |
| ------------------------- | --------- | --------------------: | ------------------: | -------------------------------------------------------------------------- |
| `--color-clay-strong`     | `#A14E2F` |           **5.09 AA** |                3.16 | Body text `clay` on light                                                  |
| `--color-moss-strong`     | `#5A5E4F` |           **5.89 AA** |                2.73 | Body text `moss` on light                                                  |
| `--color-cool-sky-strong` | `#3E6572` |           **5.61 AA** |                2.87 | Body text `cool-sky` on light                                              |
| `--color-copper-strong`   | `#9C5F2E` |           **4.97 AA** |                ~4.2 | Copper hue shifted for light when unavoidable — prefer copper only on dark |
| `--color-clay-light`      | `#E07A5F` |                  2.61 |         **6.16 AA** | `clay` on dark                                                             |
| `--color-moss-light`      | `#A8AD9A` |                  2.04 |         **7.89 AA** | `moss` on dark                                                             |

### Contrast matrix

| Foreground → Background  | Ratio | AA normal (4.5) | AA large/UI (3.0) | Verdict                           |
| ------------------------ | ----: | :-------------: | :---------------: | :-------------------------------- |
| Deep ink → Warm paper    | 16.07 |       yes       |        yes        | approved body                     |
| Deep ink → Warm white    | 17.90 |       yes       |        yes        | approved body                     |
| Clay → Warm paper        |  4.01 |     **no**      |        yes        | **forbidden** — use `clay-strong` |
| Moss → Warm paper        |  4.47 |     **no***     |        yes        | **forbidden** — use `moss-strong` |
| Copper → Warm paper      |  2.30 |       no        |        no         | **never body**                    |
| Copper → Deep ink        |  7.00 |       yes       |        yes        | approved on dark                  |
| Cool sky → Deep ink      |  8.20 |       yes       |        yes        | approved on dark                  |
| Clay-strong → Warm paper |  5.09 |       yes       |        yes        | approved                          |
| White → Clay             |  4.54 |       yes       |        yes        | badge on clay                     |

### Failing pairs and alternatives

| Forbidden pair                  | Why                        | Alternative                             |
| ------------------------------- | -------------------------- | --------------------------------------- |
| Copper/Cool sky on `Warm paper` | 1.96–2.56 <3.0 fails large | Use only on `Deep ink` (7.00/8.20)      |
| Clay on `Warm paper`            | 4.01 <4.5                  | Use `--color-clay-strong` 5.09          |
| Moss on `Warm paper`            | 4.47 <4.5                  | Use `--color-moss-strong` 5.89          |
| Clay/Moss on `Deep ink`         | 4.01/3.59 <4.5             | Use `clay-light`/`moss-light` 6.16/7.89 |

## C-05 — Semantic tokens

Light is default; dark via `prefers-color-scheme: dark` and `html[data-theme]`.

| Semantic              | Maps to       |      Ratio |
| --------------------- | ------------- | ---------: |
| `--color-bg`          | `warm-white`  | body 17.90 |
| `--color-text`        | `deep-ink`    |          — |
| `--color-text-faint`  | `moss-strong` |       5.89 |
| `--color-accent-text` | `clay-strong` |       5.09 |
| `--color-success`     | `#2E6B4A`     |       6.38 |
| `--color-warning`     | `#8A5A1A`     |       5.12 |
| `--color-error`       | `#9B2C2C`     |       7.15 |
| `--color-info`        | `#2A5F7A`     |       6.02 |

Dark flips to `Deep ink` bg with `clay-light`/`moss-light`/copper.

## C-06 — Section themes

Shared: spacing, typography, grid, a11y. Variable: `--theme-accent*`, surface tint.

Scoping: `<html data-section="dotfiles">` or `<section data-theme="dotfiles">`.

| Section        | Primary accent      | On warm-paper | Secondary                                  | Verdict                                  |
| -------------- | ------------------- | ------------: | ------------------------------------------ | ---------------------------------------- |
| Dotfiles       | Plum `#8A4D6A`      |   **5.54 AA** | Pink `#E8A0BF` 1.82 fail light / 8.84 dark | Plum approved                            |
| Workstation    | Blue `#1E5A8A`      |   **6.43 AA** | Cyan 1.89 fail light / 8.49 dark           | Cyan dark-only                           |
| Toolkit        | Violet `#6B4A9C`    |     ~6.95 AAA | —                                          | —                                        |
| V              | V Blue `#1E5A8A`    |   **6.43 AA** | —                                          | —                                        |
| Create Awesome | Amber-700 `#9A6200` |   **4.92 AA** | —                                          | Amber primitive 1.90 fail — must use 700 |

## C-07 — Typography

- **Sans**: `Inter, ui-sans-serif, system-ui, ...` — 0 KB today; `font-display: swap` if webfont
- **Mono**: `ui-monospace, SFMono-Regular, ...`
- **Scale**: 1.25 ratio, 16px base, fluid `clamp()` for hero/h1/h2
- **Line-height**: body 1.65 (≥1.5), headings 1.2–1.3, code 1.6
- **Measure**: 45ch / 65ch / 75ch / 68ch prose

## C-08 — Spacing/grid

- **Scale**: `--space-1` 0.25rem → `--space-24` 6rem, 4/8
- **Breakpoints**: 640 / 768 / 1024 / 1280
- **Containers**: 720px content, 1120px wide, `gutter` clamp(1rem,4vw,2rem)
- **Grid**: 12-col, gap 16→24→32, `.col-*` utilities
- **Reflow**: 320px & 400% zoom no scroll; touch ≥44px

## Checklist a11y

### Color

- [ ] Every pair documented with ratio & AA verdict
- [ ] Normal ≥4.5, large/UI ≥3, focus ≥3
- [ ] No body on Copper/Cool sky light
- [ ] Clay/Moss uses strong/light variants
- [ ] Dark re-checked

### Typography

- [ ] Body leading ≥1.5 (1.65), never justify
- [ ] 200% resize no clipping (75ch)
- [ ] `font-display: swap` if webfont

### Layout

- [ ] Reflow 320px & 400% zoom
- [ ] Touch ≥44px
- [ ] Focus visible, skip link

### Motion

- [ ] `prefers-reduced-motion: reduce`

Changelog: created for `feat/epic-c-tokens` — C-04→C-08.
