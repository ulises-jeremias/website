# V — V Ecosystem feature

> Feature module for `/v` — V language, VSL, VTL, RxV, setup-v, Awesome V. Overview, cards, and HTML/CSS/SVG diagrams. Theme accent #1e5a8a.

## Structure

```text
v/
├── components/
│   ├── VOverview.astro           # ecosystem narrative + facts + verify details + sections
│   ├── VCard.astro               # reusable project card (icon, repo, highlights)
│   ├── VCards.astro              # grid of VProject cards
│   ├── EcosystemDiagram.astro    # SVG: V → VSL/VTL/RxV → setup-v
│   ├── VSLDiagram.astro          # SVG: Sierpinski fractal + backend pills + vis row
│   ├── VTLDiagram.astro          # SVG: autograd forward/backward graph + code + modules
│   ├── RxVDiagram.astro          # SVG: source→filter→map→reduce→subscriber + thread row
│   └── SetupVDiagram.astro       # SVG: 5-stage GH Action pipeline + outputs + runners
├── data/
│   └── index.ts                  # vProjects, vSections, backends, modules, operators, pipeline, licenses, meta
├── types/
│   └── index.ts                  # VProject, VSection, VDiagramStep, VLicenseEntry, VBackend, VOperatorGroup
├── index.ts                      # public API
└── README.md
```

## Design decisions

- **Identity**: `v.css` accent #1e5a8a (6.43 AA on warm-paper), subtle `color-mix(7%, warm-paper)`, border `16% sand`. No Veasel binary — text note references `vlang/v-mascot/LICENSE` and prefers original illustration.
- **Cards**: HTML/CSS only, hover lift + border tint, keyboard `:focus-within` outline, `↗` external affordance with `rel="noopener noreferrer"` and sr-only text.
- **Diagrams**: pure SVG `role="img"` + `<title>`/`<desc>` + per-node `tabindex="0"` + `role="listitem"` + `aria-label`, dashed arrows for dependency / backward flow, `prefers-reduced-motion` disables transitions, fallback chips/tables as CSS grids.
- **Sections**: data-driven `vSections` for overview; each diagram has paired explanatory cards with code snippets (monospace on dark #0f2a44).
- **Verification**: `VOverview` includes `<details>` verifying proof-over-vanity and Veasel policy. Licenses exported from `data/index.ts`.

## Usage

```astro
---
import { VOverview, VCards, EcosystemDiagram, VSLDiagram, VTLDiagram, RxVDiagram, SetupVDiagram } from '@/features/v';
---

<VOverview />
<EcosystemDiagram />
<VCards />
<VSLDiagram />
<VTLDiagram />
<RxVDiagram />
<SetupVDiagram />
```

Page thin router: `src/pages/v/index.astro` via `SectionLayout(theme="v")`.

## Licenses verified

- `website/LICENSE` — MIT 2025-2026 Ulises Jeremias Cornejo Fandos
- `vlang/v`, `vlang/vsl`, `vlang/vtl`, `vlang/setup-v`, `vlang/awesome-v` — MIT
- `ulises-jeremias/rxv` — MIT, zero dependencies
- `vlang/v-mascot` — check LICENSE before using Veasel; otherwise original illustration
