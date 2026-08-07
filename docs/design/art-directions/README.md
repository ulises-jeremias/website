# Art-direction prototypes — Digital Nest (C-02)

High-fidelity, self-contained HTML prototypes for GitHub issue **C-02** (#51).  
**Gate:** Ulises selects one direction in **C-03** (#52) before site-wide redesign. Do not treat any recommendation below as the decision.

## How to open

Each direction is a single static file (inline CSS, system fonts only — no build step).

### Option A — file URL

```bash
# from repo root
xdg-open docs/design/art-directions/A-editorial-workshop/index.html
# or open the path in a browser:
# file:///…/docs/design/art-directions/A-editorial-workshop/index.html
```

### Option B — local static server

```bash
pnpm dlx serve docs/design/art-directions
# then visit /A-editorial-workshop/ etc.
```

### Option C — later site preview

If these paths are ever wired into Astro/`pnpm preview`, use that host; until then, prefer A or B.

### Prototypes

| Direction                                   | Path                                                                   | Extra world         |
| ------------------------------------------- | ---------------------------------------------------------------------- | ------------------- |
| **A** Editorial Workshop / Field Guide      | [`A-editorial-workshop/index.html`](./A-editorial-workshop/index.html) | HorneroConfig       |
| **B** Technical Atlas / Constructed Systems | [`B-technical-atlas/index.html`](./B-technical-atlas/index.html)       | Agentic Workstation |
| **C** Living Workbench                      | [`C-living-workbench/index.html`](./C-living-workbench/index.html)     | Create Awesome      |

Each file includes anchor screens: `#home-desktop` · `#home-worlds` · `#toolkit` · `#extra` · `#home-mobile`.

## Comparison matrix

| Criterion                     | Direction A · Editorial Workshop                                      | Direction B · Technical Atlas                                                       | Direction C · Living Workbench                                                 |
| ----------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Personal identity**         | **High** — serif masthead, marginal metaphor, human field-guide voice | **Med** — clear name/role in modules; colder, more system than person               | **High** — warm paper persona + instrument panel; status as craft, not chrome  |
| **Technical depth**           | **Med** — annotated plate + install notes; depth is literary          | **High** — coordinates, topology, exploded anatomy, SVG distribution, 4-layer stack | **High** — causal toolkit pipeline + realistic CLI; denser instrument language |
| **Distinctiveness**           | **High** — notebook/editorial grammar vs. current card SaaS           | **High** — atlas/grid language; least like a portfolio template                     | **High** — dual surface (paper + dark panels); sticky stage narrative          |
| **Navigation clarity**        | **Med–High** — unequal editorial index; denser on first scan          | **High** — region IDs (R-10…R-90) and topo list map priority                        | **High** — lane labels + context panel; toolkit TOC is explicit                |
| **Agent Toolkit suitability** | **Med** — field plate works; causality is shorter than C              | **High** — anatomy + one-source→targets diagram matches product story               | **Highest** — stage narrative (Request→…→Artifact) is the flagship UX          |
| **Blog suitability**          | **Highest** — serif, rules, figures map cleanly to long-form          | **Med** — atlas chrome may overpower prose unless softened                          | **Med–High** — paper framing fits posts; dark panels better for tooling pages  |
| **Accessibility**             | **High** — ink/paper contrast, visible focus, semantic sections       | **High** — strong text contrast; mono labels need care for size                     | **High** — dual themes; chips used as status, not sole meaning                 |
| **Implementation complexity** | **Low–Med** — CSS grid + rules; few diagrams                          | **Med–High** — SVG topology, coordinate system, stack modules                       | **Med–High** — sticky stage, dual palettes, composition strip                  |
| **Performance**               | **High** — minimal CSS, no assets                                     | **High** — inline SVG only; light                                                   | **High** — self-contained; sticky nav is CSS-only                              |

## Recommendation (advisory only)

**Ulises must select — do not treat this recommendation as the decision.**

For a nest that must sell **Agent Toolkit** as the flagship while still feeling personal, **Direction C (Living Workbench)** is the strongest advisory pick: personal framing on paper, instrument surfaces for tooling, and a causal toolkit stage that replaces the current wireframe/swarm rects. Prefer **A** if long-form blog and editorial craft should lead the brand. Prefer **B** if the site should read primarily as a constructed systems atlas (coordinates, stack, distribution diagrams) with cooler technical surfaces.

Whatever is chosen in C-03 should still absorb shared wins from the others (A’s unequal world weight, B’s distribution SVG clarity, C’s toolkit causality).

## Related docs

- [UI/UX recovery audit](../audits/2026-08-07-uiux-recovery-audit.md)
- Baseline contact sheets: [`../baselines/2026-08-07/contact-sheets/`](../baselines/2026-08-07/contact-sheets/)
- Full viewport baselines: [`../baselines/2026-08-07/`](../baselines/2026-08-07/)
- Design tokens: [`../tokens.md`](../tokens.md)
- Navigation spec: [`../navigation.md`](../navigation.md)
