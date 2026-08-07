# dotfiles — HorneroConfig feature

> Feature module for `/dotfiles` — narrative, layers diagram, Smart Colors animation, screenshots, licensing. Identity plum #191114 / pink #FFB0CA.

## Structure

```
dotfiles/
├── components/
│   ├── DotfilesNarrative.astro       # 3-section narrative (hornero principle)
│   ├── LayersDiagram.astro           # SVG accesible: shell/compositor/terminal/scripts/chezmoi
│   ├── SmartColorsAnimation.astro    # wallpaper→extraction→palette→apps + controls + reduced-motion
│   └── ScreenshotGallery.astro       # 6 figures lazy + placeholders + license notes
├── data/
│   └── index.ts                      # layers, narrative, smartColorSteps, screenshots, licenses
├── types/
│   └── index.ts
├── index.ts                          # public API
└── README.md
```

## Design decisions

- **Identidad**: `--dotfiles-plum: #191114` (bg), `--dotfiles-pink: #FFB0CA` (accent). Contraste WCAG AA+ verificado (plum/pink > 7:1). Superficies en #2d2027/#241a1f.
- **Layers SVG**: `role="img"` + `<title>/<desc>` + `tabindex="0"` por capa + fallback textual sr-only + tabla legend. Flechas dashed indican dependencia; focus ring en `:focus-visible`.
- **Smart Colors**: 4 pasos animados con JS `setInterval(2200)` + barra progreso, `aria-live` + `aria-current="step"`, controles Pausar/Reanudar/Repetir/Ver estatico, `prefers-reduced-motion: reduce` desactiva autoplay y muestra grid estatico, teclado Espacio/R y `visibilitychange` pause.
- **Galeria**: `figure` grid 1→2→3 cols, `loading="lazy"`, placeholder frame + `<img>` sr-only con `alt` descriptivo, `data-src` a raw.githubusercontent para swap optimo, notas de integracion para `astro:assets`.
- **Licencias**: entries en `data/index.ts` y seccion verificada en page. MIT sitio + MIT dotfiles + GPL-3.0 Quickshell adaptado de caelestia-dots/shell.

## Usage

```astro
---
import { DotfilesNarrative, LayersDiagram, SmartColorsAnimation, ScreenshotGallery } from '@/features/dotfiles';
---

<DotfilesNarrative />
<LayersDiagram />
<SmartColorsAnimation />
<ScreenshotGallery />
```

Page thin router: `src/pages/dotfiles.astro`.

## Licenses verified

- `website/LICENSE` — MIT 2025-2026 Ulises Jeremias Cornejo Fandos
- `dotfiles/LICENSE` — MIT 2019-2025 (same author)
- `caelestia-dots/shell` — GPL-3.0 (adapted Quickshell) — attribution required

Screenshots `static/*.png/jpg` MIT; wallpapers per-rice may vary — verify before redistributing.

## Accessibility checklist

- [x] SVG title/desc, listitem roles, keyboard focus
- [x] Smart Colors controls with aria-pressed, aria-controls, aria-live, keyboard shortcuts, reduced-motion fallback + static
- [x] Gallery figures with figcaption, alt, lazy
- [x] Page lang es, skip link, semantic landmarks, color contrast plum/pink
