# Art-direction prototypes — Digital Nest (C-02 / C-03)

High-fidelity, self-contained HTML prototypes for GitHub issue **C-02** (#51).  
**Gate: Ulises selects** one direction in **C-03** (#52) before site-wide redesign. Do not treat any recommendation below as the decision.

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

| Direction                                   | Path                                                                     | Extra world         | Family |
| ------------------------------------------- | ------------------------------------------------------------------------ | ------------------- | ------ |
| **A** Editorial Workshop / Field Guide      | [`A-editorial-workshop/index.html`](./A-editorial-workshop/index.html)   | HorneroConfig       | Light  |
| **B** Technical Atlas / Constructed Systems | [`B-technical-atlas/index.html`](./B-technical-atlas/index.html)         | Agentic Workstation | Light  |
| **C** Living Workbench                      | [`C-living-workbench/index.html`](./C-living-workbench/index.html)       | Create Awesome      | Dual   |
| **D** Cyberpunk / Neon Systems              | [`D-cyberpunk-neon/index.html`](./D-cyberpunk-neon/index.html)           | Agentic Workstation | Dark   |
| **E** Synthwave / Retrowave                 | [`E-synthwave-retrowave/index.html`](./E-synthwave-retrowave/index.html) | HorneroConfig       | Dark   |
| **F** Vaporwave / Softwave                  | [`F-vaporwave-softwave/index.html`](./F-vaporwave-softwave/index.html)   | Create Awesome      | Dark   |

Each file includes anchor screens: `#home-desktop` · `#home-worlds` · `#toolkit` · `#extra` · `#home-mobile`.

---

## Light / dual family (A–C) — original C-02 set

### Comparison matrix

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

### Recommendation (advisory only) — A/B/C

**Ulises must select — do not treat this recommendation as the decision.**

For a nest that must sell **Agent Toolkit** as the flagship while still feeling personal, **Direction C (Living Workbench)** is the strongest advisory pick among the light/dual set: personal framing on paper, instrument surfaces for tooling, and a causal toolkit stage that replaces the current wireframe/swarm rects. Prefer **A** if long-form blog and editorial craft should lead the brand. Prefer **B** if the site should read primarily as a constructed systems atlas (coordinates, stack, distribution diagrams) with cooler technical surfaces.

Whatever is chosen in C-03 should still absorb shared wins from the others (A’s unequal world weight, B’s distribution SVG clarity, C’s toolkit causality).

---

## Dark family (2026-08-07 request) — D / E / F

User requested a **dark cyberpunk / synthwave / vaporwave** family after reviewing A/B/C. These three are dark-by-default, obviously distinct from each other and from the warm A/B/C set. Neon accents decorate; **body text stays light-on-dark** (`#e8eef5` or equivalent) for ≥4.5 contrast — do not ship illegible neon-on-black copy.

**Advisory:** pick for toolkit flagship + personal identity without illegible neon-on-black body text.

### Comparison matrix — dark family

| Criterion                     | Direction D · Cyberpunk / Neon                                        | Direction E · Synthwave / Retrowave                                        | Direction F · Vaporwave / Softwave                                                    |
| ----------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Personal identity**         | **Med–High** — HUD identity + terminal session; sharp systems persona | **High** — chrome wordmark + album-side worlds; 80s synth cover meets docs | **Highest** — serif masthead + marginal metaphor on plum; soft nostalgia, human voice |
| **Technical depth**           | **Highest** — network SVG, boot log, mono-heavy HUD chrome            | **High** — glowing layered stack; geometric labels; desktop-rice extra     | **Med–High** — annotated soft neon plate + causal flow; less terminal chrome than D   |
| **Distinctiveness**           | **High** — scanlines, corner brackets, acid cyan/magenta              | **High** — perspective grid floor, sunset glow, hot pink / violet / orange | **High** — unequal editorial density, lavender/aqua/pink, sparse glitch               |
| **Navigation clarity**        | **High** — node IDs (N-01…) + channel list                            | **High** — tracklist + lane labels                                         | **Med–High** — field-guide atlas; denser editorial scan                               |
| **Agent Toolkit suitability** | **Highest** — neon distribution network (one source → assistants)     | **High** — glowing 4-layer stack (skills→profiles) matches product anatomy | **High** — soft annotated plate + install rails; causality present                    |
| **Blog suitability**          | **Med** — HUD chrome may dominate long prose                          | **Med** — album energy suits landing; soften for posts                     | **Highest** (of dark set) — serif + plate grammar maps to long-form                   |
| **Accessibility**             | **High if disciplined** — cyan/magenta decorative; body off-white     | **High if disciplined** — pink accents; body off-white on navy/purple      | **High** — soft accents; marble/serif on dark plum with readable contrast             |
| **Implementation complexity** | **Med–High** — scanlines, brackets, SVG net, boot HUD                 | **Med–High** — perspective grid, sun glow, layered stack, rice desk        | **Med** — editorial grid + softplate; light glitch CSS                                |
| **Performance**               | **High** — CSS-only motion; respects `prefers-reduced-motion`         | **High** — CSS grid/sun animations; reduced-motion kills them              | **High** — sparse animation; reduced-motion safe                                      |
| **Extra world**               | Agentic Workstation as **boot / provision HUD**                       | HorneroConfig as **desktop rice · neon dusk**                              | Create Awesome as **composition ritual**                                              |

### Recommendation (advisory only) — D/E/F

**Gate: Ulises selects.** Do not treat this as the decision.

- Prefer **D** if the nest should feel like a neon systems console (toolkit as distribution network, workstation boot HUD).
- Prefer **E** if personal brand should read as synth album cover × systems docs (toolkit as glowing stack, HorneroConfig rice).
- Prefer **F** if dark mode should stay editorial and blog-friendly (softwave nostalgia + technical plates, Create Awesome ritual).

Across the dark family, keep shared wins: unequal world weight, readable body contrast, toolkit causality, and CTAs (Collaborate / Discord / GitHub).

---

## Cross-family note for C-03

Six directions are now in play (A–F). Selection can stay within one family or hybridize (e.g. C’s toolkit stage language + D’s distribution diagram, or F’s serif identity on a dark shell). **Gate: Ulises selects** before production redesign.

## Related docs

- [UI/UX recovery audit](../audits/2026-08-07-uiux-recovery-audit.md)
- Baseline contact sheets: [`../baselines/2026-08-07/contact-sheets/`](../baselines/2026-08-07/contact-sheets/)
- Full viewport baselines: [`../baselines/2026-08-07/`](../baselines/2026-08-07/)
- Design tokens: [`../tokens.md`](../tokens.md)
- Navigation spec: [`../navigation.md`](../navigation.md)
