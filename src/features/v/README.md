# V — V Ecosystem feature

> Feature module for `/v` — V language, VSL, VTL, RxV, setup-v, Awesome V. Overview, cards, and HTML/CSS/SVG diagrams. Theme accent #1e5a8a.

## Structure

```text
v/
├── components/
│   ├── VOverview.astro           # thin V Lab identity strip and station labels
│   ├── VComputationalLab.astro   # station scenes, inspector, dock, and license list
│   ├── VCard.astro               # reusable project card (icon, repo, highlights)
│   ├── VCards.astro              # grid of VProject cards
│   ├── VSLDiagram.astro          # SVG: Sierpinski fractal + backend pills + vis row
│   ├── VTLDiagram.astro          # SVG: autograd forward/backward graph + code + modules
│   ├── RxVDiagram.astro          # SVG: source→filter→map→reduce→subscriber + thread row
│   ├── SetupVDiagram.astro       # SVG: 5-stage GH Action pipeline + outputs + runners
│   └── scenes/                   # station-specific computational lab scenes
├── data/
│   └── index.ts                  # vProjects, vSections, backends, modules, operators, pipeline, licenses, meta
├── types/
│   └── index.ts                  # VProject, VSection, VDiagramStep, VLicenseEntry, VBackend, VOperatorGroup
├── index.ts                      # public API
└── README.md
```

## Design decisions

- **Identity**: `v.css` accent #1e5a8a (6.43 AA on warm-paper), subtle `color-mix(7%, warm-paper)`, border `16% sand`. Veasel binary (`public/media/v/veasel.webp`) embedded in `VComputationalLab` with on-page attribution; upstream license is CC BY-NC 4.0 — usage decision tracked in [#170](https://github.com/ulises-jeremias/website/issues/170).
- **Cards**: HTML/CSS only, hover lift + border tint, keyboard `:focus-within` outline, `↗` external affordance with `rel="noopener noreferrer"` and sr-only text.
- **Diagrams**: pure SVG `role="img"` + `<title>`/`<desc>` + per-node `tabindex="0"` + `role="listitem"` + `aria-label`, dashed arrows for dependency / backward flow, `prefers-reduced-motion` disables transitions, fallback chips/tables as CSS grids.
- **Sections**: data-driven `vSections` for overview; each diagram has paired explanatory cards with code snippets (monospace on dark #0f2a44).
- **Verification**: `VComputationalLab` renders the visible license list and Veasel policy note from `licenseEntries`; the station inspector keeps project details discoverable without disclosure controls.

## Usage

```astro
---
import { VOverview, VCards, VSLDiagram, VTLDiagram, RxVDiagram, SetupVDiagram } from '@/features/v';
---

<VOverview />
<VCards />
<VSLDiagram />
<VTLDiagram />
<RxVDiagram />
<SetupVDiagram />
```

Page thin router: `src/pages/v/index.astro` via `SectionLayout(theme="v")`.

## Licenses verified

- `website/LICENSE` — MIT 2025-2026 Ulises Jeremias Cornejo Fandos
- `vlang/v`, `vlang/vsl`, `vlang/vtl`, `vlang/setup-v` — MIT
- `vlang/awesome-v` — CC0 1.0
- `ulises-jeremias/rxv` — MIT, zero dependencies
- `vlang/v-mascot` — CC BY-NC 4.0; Veasel is currently embedded with attribution; final usage decision in [#170](https://github.com/ulises-jeremias/website/issues/170)
