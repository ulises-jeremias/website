# Digital Nest — Final Production Report

**Branch:** `feat/final-digital-nest-production`  
**Base:** `main` @ `f05db66` (#322 ZIP synthwave fidelity)  
**Epic:** [#319](https://github.com/ulises-jeremias/website/issues/319) — stays OPEN until human homepage/product sign-off  
**Art direction:** Synthwave Systems Atlas (#52 CLOSED — do not reopen)  
**Canonical host:** `https://www.ulises-jeremias.dev/`  
**Report date:** 2026-08-07

## Verification

| Check                       | Result                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                 | **108/108 passed**                                                                                                                            |
| `pnpm type-check`           | **0 errors** (hints only)                                                                                                                     |
| `pnpm build`                | **11 pages** static build OK                                                                                                                  |
| Playwright golden snapshots | **NOT updated** — ship authorized without golden refresh; goldens remain prior ZIP fidelity baseline unless CI requires an intentional update |
| Close #319 / #86            | **NOT done** — code may merge; epic stays open pending visual acceptance                                                                      |

## Visual truth hierarchy

1. Attached synthwave reference image wins over ZIP card layout.
2. ZIP assets (hero-bg, island-*, Orbitron/JetBrains) may be reused.
3. Homepage worlds are illustration-first floating dioramas (~9–13.5rem art), not ~88px neon cards.

## Gate status

| Gate             | Status                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Homepage visual  | **SHIP AUTHORIZED by product owner** — merge may proceed; formal golden acceptance still pending |
| Golden snapshots | Not updated for this ship unless CI fails on intentional UI changes                              |
| Epic #319 close  | Remains OPEN after merge — awaiting visual acceptance note                                       |

Formal gate replies still useful: **APPROVED** · **APPROVED WITH NOTES** · **REJECTED**.

## What shipped on this branch

### Wave 0 — Audit + factual truth

- Production crawl + screenshots: `docs/design/final-production/audit/`
- Audit write-up: `AUDIT.md`
- Dangerous fixes: `#galeria` → `#gallery`; English copy; CVA URL; community template name; removed fake archived Create Awesome; no public Epic labels

### Wave 1 — Homepage dioramas (candidate)

- `ProjectWorld` / `ProjectAtlas` / `home.css` rebuilt as platforms + label plates + underglow
- Order: Dotfiles → **Toolkit** → Workstation → …
- Comparison package: `reference-comparison/`
- Gate doc: `HOME-VISUAL-GATE.md`

### Community — Digital Nest workshop

- Umbrella workshop (not Create Awesome–only): HorneroConfig, Workstation, Agentic Harness, Toolkit, Create Awesome families, V ecosystem
- Incubating blueprints without fake URLs
- Discord invite verified; no invented channels/CoCs
- Scope doc: `COMMUNITY-SCOPE.md`

### Workstation + Harness

- `agentic-harness` identity (no `ai-workspace` public links)
- Inventory counts wired from Agent Toolkit snapshot
- Ecosystem SVG uses live inventory counts

### Agent Toolkit

- Single inventory snapshot: `inventory.snapshot.json` + `pnpm data:refresh` companion script for toolkit sync
- UI/SEO/home/worlds read `inventoryStrip()` — no scattered hardcodes

### V + Create Awesome

- Removed unsourced speed theatre / invented quotes
- Hero copy accurate (V + VSL/VTL/RxV/setup-v)
- Composer assembles family-correct CLI commands (`buildCommand.ts`)
- Licenses collapsed behind `<details>`

### Dotfiles

- Stronger hero scene + gallery path
- HEAD-verified facts: **12 themes** / **47 dots-*** (not 22/~46)
- Attribution disclosure (not public audit checklist noise)

### Projects + Open Source

- World visibility model in projects ledger
- Committed GitHub evidence cache: `src/data/generated/github-evidence.json`
- Zod schema + editorial overrides + `pnpm data:refresh`
- Honest provenance copy (seed/offline until refresh stamps)

### SEO / platform

- `site: https://www.ulises-jeremias.dev` + site-url-guard
- `buildPageSeo` → BaseLayout/BaseHead (canonical, OG, Twitter, theme-color)
- Home emits WebSite + Person JSON-LD
- Blog CollectionPage / BlogPosting JSON-LD when posts exist
- Honest empty blog desk + cross-links
- 404 SIGNAL LOST composition
- robots.txt / sitemap / RSS on production host

## Intentionally NOT done

1. **Human homepage approval** — required before golden snapshot updates
2. **Closing #319 / visual issues** — requires Ulises sign-off
3. **Live GitHub metrics in UI** — cache may refresh; volatile stays empty unless stamped
4. **Invented blog posts / Discord channels / CoCs / portraits**
5. **Three.js / global React**

## Issue reconciliation posture

| Issue family                    | Posture                                        |
| ------------------------------- | ---------------------------------------------- |
| #319 epic                       | OPEN — evidence accumulating; await acceptance |
| #52 art direction               | CLOSED — do not reopen                         |
| #86 / visual goldens            | Wait for homepage APPROVED                     |
| Factual / SEO / community / OSS | Addressed on branch; cite this report in #319  |

## Human next step

1. Code ship authorized — merge when CI green
2. Review `docs/design/final-production/reference-comparison/` for formal visual acceptance
3. After APPROVED: update Playwright goldens if needed and consider closing visual issues
4. Close #319 only after visual/product acceptance (not on merge alone)
