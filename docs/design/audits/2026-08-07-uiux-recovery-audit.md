# UI/UX Recovery Audit — Digital Nest — 2026-08-07

> Phase A (repository + GitHub + visual baseline) and Phase B (route UX audit).
> Art-direction prototypes: `docs/design/art-directions/`.
> **Gate 3:** Ulises must select a direction in #52 before site-wide redesign.

## Repository snapshot

| Item            | Value                                        |
| --------------- | -------------------------------------------- |
| HEAD            | `1c47467` (i18n English sweep after PR #318) |
| Branch          | `design/uiux-audit-and-foundation`           |
| Framework       | Astro 7 static, pnpm                         |
| Integration PRs | #317 (B–F foundation), #318 (G–M worlds)     |
| Pages built     | 11 (+404, robots, rss, sitemap)              |

## Verified P0 findings

### P0.1 — Design-system entry point not loaded globally

`src/styles/index.css` imports tokens, typography, spacing, semantic, themes — but **no layout or page imports it**.

Actual CSS loading:

| Surface              | Imports                                                                             |
| -------------------- | ----------------------------------------------------------------------------------- |
| `/`                  | `tokens.css` + `home.css` only                                                      |
| SectionLayout worlds | **none** of the design-system entry (rely on hard-coded fallbacks in component CSS) |
| `/dotfiles`          | `dotfiles.css` only                                                                 |
| `/blog`              | `blog.css`                                                                          |

`BaseLayout` / `BaseHead` do not load the design system. Themes as `data-theme` hooks are therefore mostly inert unless a page happens to redefine variables.

### P0.2 — Typography names without delivery

`typography.css` / `blog.css` / workstation SVGs name `Inter` and `Fraunces`. No `@font-face`, no Google Fonts link, no self-hosted files. Runtime falls back to system UI — unintentional unless documented as Option A.

### P0.3 — Competing global shells

| Shell              | Used on              | Brand                  | Nav                                       |
| ------------------ | -------------------- | ---------------------- | ----------------------------------------- |
| `Header.astro`     | `/`                  | `UJ` + Ulises Jeremias | Home, Blog, GitHub, Contact               |
| `SiteHeader.astro` | SectionLayout worlds | `⬢ Digital Nest`       | All worlds (desktop + mobile details)     |
| Dotfiles bespoke   | `/dotfiles`          | `◉ ulises-jeremias`    | Inicio / Blog / dotfiles (mixed language) |

Homepage **hides project worlds** from the header while SiteHeader exposes them. Spec in `docs/design/navigation.md` is not what ships on `/`.

### P0.4 — Agent Toolkit is a wireframe in production

- `Hero.astro`: literal heading `Hero`, raw stats, empty circle SVG
- `SwarmVisualization.astro`: colored `<rect>` per scene + public copy `No canvas, only HTML/CSS/inline SVG`
- Page appends budget/install with weak hierarchy

Treat Epic H presentation as **prototype**, not completed UX.

### P0.5 — Card/pill grammar overuse

`border-radius: 999px` / pill radius / `translateY(-1..-3px)` hover appear across home, community, v, create-awesome, workstation, projects, shared Card/Badge. Worlds differ mainly by accent hex.

### P0.6 — Theme CSS stores English art-direction strings as custom properties

Example (`themes/toolkit.css`): `--theme-illustration`, `--theme-shape`, `--theme-texture` hold descriptive English — not visual implementations.

### P0.7 — Public copy leaks + language mix

Still visible after “English sweep” commits:

- Epic IDs: `Epic F`, `Epic G`, `Epic J`, `Epic K`, `Epic M`
- Placeholder: `Hero`, `No canvas…`
- Spanish/English mix on `/dotfiles`, `/v`, `/projects`, `/create-awesome`, `/agent-toolkit` (e.g. `escritos una vez`, `Laboratorio computacional`, `tratamiento sutil para archivados`)
- `html lang="en"` while Spanish remains

### P0.8 — Duplicated facts drift

| Fact                 | Locations                                                                          | Conflict |
| -------------------- | ---------------------------------------------------------------------------------- | -------- |
| Agent Toolkit skills | home hero SVG / home data / workstation pages → **52**; toolkit page/data → **61** | Drift    |

## What to preserve

Astro static-first, feature modules, Zod boundaries, route metadata + canonical helpers, a11y landmarks / reduced-motion hooks (Smart Colors), CI gates, useful tests, project research content, Smart Colors interaction semantics.

## Visual baseline

Captured production preview (`pnpm build` + `pnpm preview`) at 1440 / 1024 / 768 / 390 / 360 for all major routes, plus reduced-motion and `prefers-color-scheme: dark` first viewports.

- Full set: `docs/design/baselines/2026-08-07/{desktop-1440,…}/`
- Contact sheets: `docs/design/baselines/2026-08-07/contact-sheets/`

## Route UX audit (severity)

| Route                  | Purpose in 5s?                      | Severity     | Primary problems                                                              |
| ---------------------- | ----------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `/`                    | Partial (bio yes, worlds buried)    | **Critical** | SaaS grammar; card grids; nest diagram = rounded modules; header lacks worlds |
| `/dotfiles`            | Weak (identity strong, story mixed) | **High**     | Separate shell; ES/EN mix; Epic F; placeholder gallery SVGs; pill overload    |
| `/agentic-workstation` | Medium                              | **High**     | Epic G eyebrow; radial glow cyber look; LayerCard grid; 52-skill drift        |
| `/agent-toolkit`       | Fail                                | **Critical** | Wireframe hero/swarm; implementation copy; emoji capability cards             |
| `/v`                   | Medium                              | **High**     | Card grid + ES copy; diagrams exist but sit in card chrome                    |
| `/create-awesome`      | Medium                              | **High**     | Three equal product cards; Epic J; mixed language                             |
| `/community`           | Medium                              | **Medium**   | Workshop narrative OK; still pill/card chrome; Discord CTA competes           |
| `/blog`                | OK empty state                      | **Medium**   | Editorial intent OK; SiteHeader duplicate nav; emoji desk                     |
| `/projects`            | Weak                                | **High**     | Epic M; mixed/broken Spanish fragment; card catalog only                      |
| `/open-source`         | Weak                                | **High**     | Spec prose / pipeline notes as page content; not evidence ledger              |
| `/404`                 | Minimal                             | **Low**      | Generic; fine for now                                                         |

## GitHub reconciliation (summary)

- **DONE — VERIFIED:** #31 A-01, #40 B-01, #41 B-02, #68 D-02 (metadata helpers exist) — with caveats
- **IMPLEMENTED — UX FAILED:** #86 E-03 (closed without human design review), #69 D-03 (layout exists, over-constrains), F-03..F-07 closed design tasks with card/pill UX
- **PARTIALLY IMPLEMENTED:** Epics #20–#28 content/routes exist; design AC mostly unmet
- **NOT STARTED:** Most H-_design issues (#131–#167); N-_ pipeline; much of O-* QA
- **NEEDS HUMAN DESIGN APPROVAL:** #51 C-02 (prototypes), #52 C-03 (selection gate)
- **Leave closed + follow-up:** #53 C-04, #54 C-05 token files exist — re-validate after art-direction selection

Full matrix maintained in issue comments / recovery epic — avoid committing a giant generated bookkeeping file.

## Art directions (C-02)

See `docs/design/art-directions/README.md` — Directions A / B / C as high-fidelity HTML with real content.

**Stop:** do not propagate a direction until Ulises selects in #52.
