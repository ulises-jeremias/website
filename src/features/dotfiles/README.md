# dotfiles — HorneroConfig feature

> Feature module for `/dotfiles` — narrative, layers diagram, Smart Colors animation, screenshots, attribution. Identity plum #191114 / pink #FFB0CA.

## Structure

```text
dotfiles/
├── components/
│   ├── DotfilesNarrative.astro       # Narrative + verified fact strip
│   ├── LayersDiagram.astro           # Accessible SVG: shell/compositor/terminal/scripts/chezmoi
│   ├── SmartColorsAnimation.astro    # wallpaper→extraction→scheme→apps + controls + reduced-motion
│   └── ScreenshotGallery.astro       # MIT static captures (anime/collage omitted)
├── data/
│   └── index.ts                      # layers, narrative, smartColorSteps, screenshots, attribution, verifiedFacts
├── types/
│   └── index.ts
├── index.ts                          # public API
└── README.md
```

## Verified HEAD facts (do not invent)

Audit against `ulises-jeremias/dotfiles` `main` before changing counts:

- **12** appearance themes under `home/dot_local/share/dots/themes/*/theme.json`
- **47** `dots-*` CLIs under `home/dot_local/bin/executable_dots-*`
- Smart Colors contract: wiki `Smart-Colors-System.md` (wallpaper → M3 → Quickshell/Kitty/GTK)

## Design decisions

- **Identity**: `--dotfiles-plum: #191114`, `--dotfiles-pink: #FFB0CA`
- **Smart Colors**: 4 animated steps with pause/replay/static + `prefers-reduced-motion`
- **Gallery**: first-party `static/*` captures only; exclude `anime.jpeg`, `anime-girl-screen.png`, and `collage.png` (anime wallpaper)
- **Attribution**: short MIT + caelestia GPL-3.0 credit — no audit/verification checklist on the product page

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
