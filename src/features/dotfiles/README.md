# dotfiles — HorneroConfig feature

> Feature module for `/dotfiles` — ownership map, reviewed-apply workflow, legacy screenshots, attribution. Identity plum #191114 / pink #FFB0CA.

## Structure

```text
dotfiles/
├── components/
│   ├── DotfilesNarrative.astro       # Narrative + verified fact strip
│   ├── LayersDiagram.astro           # Accessible SVG: shell/compositor/terminal/scripts/chezmoi
│   └── ScreenshotGallery.astro       # MIT static captures (anime/collage omitted)
├── data/
│   └── index.ts                      # ownership layers, review narrative, screenshots, attribution, verifiedFacts
├── types/
│   └── index.ts
├── index.ts                          # public API
└── README.md
```

## Verified HEAD facts (do not invent)

Verified against `ulises-jeremias/dotfiles` `main` @bf4b235 on 2026-10-04:

- Personal Arch chezmoi source for user-level apps, preferences, and optional wallpaper media
- HorneroOS owns system defaults, appearance packs, Quickshell surfaces, packages, and stable system operations
- `chezmoi diff` is reviewed before apply; package installation does not call `chezmoi apply`
- Contributions use temporary `HOME` and isolated XDG directories; shared source excludes credentials and host-specific values
- Security and testing claims come from `docs/Security-Guidelines.md`, `SECURITY.md`, and `docs/Testing-Strategy.md`; product behavior is accepted in `HorneroOS/qa`
- Gallery captures under `static/` are the X11 generation (2020–2021) and are captioned as such

## Design decisions

- **Identity**: `--dotfiles-plum: #191114`, `--dotfiles-pink: #FFB0CA`
- **Review flow**: inspect the chezmoi diff, then apply deliberately
- **Gallery**: first-party `static/*` captures only; exclude `anime.jpeg`, `anime-girl-screen.png`, and `collage.png` (anime wallpaper)
- **Attribution**: short MIT + caelestia GPL-3.0 credit — no audit/verification checklist on the product page

## Usage

```astro
---
import { DotfilesNarrative, LayersDiagram, ScreenshotGallery } from '@/features/dotfiles';
---

<DotfilesNarrative />
<LayersDiagram />
<ScreenshotGallery />
```

Page thin router: `src/pages/dotfiles.astro`.
