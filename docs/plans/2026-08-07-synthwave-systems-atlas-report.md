# Synthwave Systems Atlas — Implementation Report

**Date:** 2026-08-07  
**Branch:** `design/synthwave-foundation`  
**Repo:** `ulises-jeremias/website`  
**Status:** Implementation complete on working tree — **no commit / PR** (awaiting explicit user request)

## Decision

Human-approved art direction **Synthwave Systems Atlas** remains in force (`#52` closed). No further art-direction gate.

## Delivered

### Wave 0 — Foundation

- Global CSS entry via `BaseLayout` → `src/styles/index.css`
- Layers: reset → tokens → typography → spacing → semantic → motion → effects → themes
- Dual-role semantic bridge: dark shell roles + light-safe legacy aliases + `--world-*`
- Unified `SiteHeader` / `SiteFooter` / `MobileNav`; homepage on `SectionLayout` immersive
- Regression: `design-system.test.ts`, `site-shell.test.ts` green

### Wave 1 — Homepage atlas

- Atmosphere: stars, haze, striped sun, mountains, skyline, perspective grid
- Chrome `ULISES JEREMIAS` identity + Digital Nest mark + verified CTAs
- Nine floating world platforms with layered bases, underglow, original SVG illustrations, connection network
- Mobile recomposed vertical path (not 9-card grid)
- Evidence panels: Nest Status / About (Nest mark, no fake portrait) / Featured ledger
- Review captures: `docs/design/final/2026-08-07/home/`

### Route waves + audited facts

| Area           | Correction applied                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Dotfiles       | **22** rices, **~46** `dots-*`, `dots-appearance`, `python-materialyoucolor`                                            |
| Agent Toolkit  | **61 / 16 / 10**, **7** profiles; pair = implementer→reviewer→integrator; DevCompanion ≠ Swarm; Herdr/tmux = same state |
| Personal DX    | Graph-like; HorneroConfig **optional L0**                                                                               |
| V              | VTL = **V Tensor Library**; setup-v **`@v1.7`**; awesome-v **CC0**; Veasel policy retained (no commercial mascot embed) |
| Create Awesome | CNA 10 templates / 53 extensions; CPA 6 / 18; CVA 7 templates / 11 addons; CLI `create-vlang-app`                       |

Toolkit capability anatomy + swarm story rebuilt. Create Awesome overflow fixed (`minmax(0,1fr)` + wrap). Workstation narrative updated for graph model.

Route review captures: `docs/design/final/2026-08-07/routes/`

### QA

| Gate                                       | Result                                                              |
| ------------------------------------------ | ------------------------------------------------------------------- |
| `pnpm build`                               | 11 pages OK                                                         |
| `pnpm test`                                | **75/75**                                                           |
| `pnpm type-check`                          | **0 errors** (pre-existing hints)                                   |
| `pnpm lint`                                | 0 errors / 1 pre-existing warning                                   |
| `CI=1 pnpm test:visual --update-snapshots` | **16/16** (home + shell + route smoke)                              |
| Playwright                                 | `playwright.config.ts` + `tests/visual/{home,shell,routes}.spec.ts` |

## Limitations / remaining polish

- Community / Blog / Projects / Open Source still use earlier page structures; facts corrected where wrong, but full synthwave recomposition is lighter than homepage/toolkit.
- Blog content collection empty (`src/content/blog` glob warning).
- Visual baselines are Chromium-only (Playwright OS fallback on Arch).
- Pre-existing untracked art-direction / swarm noise left untouched.
- GitHub backlog (H-* items, stale “blocked on #52” language, malformed `#179`, `#293` linkage) needs human triage after evidence comments — not mass-closed.

## How to review locally

```bash
pnpm build && pnpm preview --host 127.0.0.1 --port 4321
CI=1 pnpm test:visual
```

Open `/` at 1440 and 390; compare with `docs/design/final/2026-08-07/home/`.

## Next (only if requested)

1. Commit on `design/synthwave-foundation`
2. Draft PR with this report + screenshot paths
3. Targeted GitHub issue closes with AC evidence
