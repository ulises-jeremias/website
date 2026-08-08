# Final production audit — Digital Nest

**Audit date:** 2026-08-07  
**Production:** https://www.ulises-jeremias.dev/  
**Repo HEAD audited:** `f05db66` (`main` — merge of #322 ZIP synthwave fidelity)  
**Working branch:** `feat/final-digital-nest-production`  
**Art direction:** Synthwave Systems Atlas (issue #52 CLOSED — do not reopen)  
**Parent epic:** #319 OPEN until human product sign-off

Evidence screenshots: `docs/design/final-production/audit/{route}/{1440,390}.png`  
Reference: `docs/design/final-production/reference-comparison/reference.png`

---

## Cross-cutting findings

| Gap                                                               | Evidence                                                                                                                               |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Project worlds are ZIP neon **cards**, not reference **dioramas** | `ProjectWorld.astro` uses `sizes="88px"`; `home.css` sets `.atlas-world { block-size: 6.75rem }` and `.atlas-world__visual { 5.5rem }` |
| Magic inventory counts live in copy                               | `project-worlds.ts` toolkit description hardcodes `61 skills · 16 agents…`; same string in NestStatus                                  |
| Create Awesome install URL 404s                                   | `create-vlang-app.vercel.app` → 404; canonical is `create-awesome-vlang-app.vercel.app`                                                |
| Broken internal anchor                                            | `/dotfiles` CTA `href="#galeria"` but section is `id="gallery"`                                                                        |
| Spanish leakage on English site                                   | `aria-label="Diagrama de capas"`; Workstation `4 capas` heading                                                                        |
| Internal backlog language on product pages                        | Workstation hero eyebrow `Epic G · …`                                                                                                  |
| Projects model misuse                                             | Create Awesome entry `status: 'archived'` solely to avoid duplication                                                                  |
| Community sample template invalid                                 | `react-vite-starter` — catalog has `react-vite-boilerplate`                                                                            |
| Profile positioning incomplete                                    | Public data has Solutions Architect / V Core / AUR; Technical Practice Leader not yet verified in `src/data/profile.ts`                |
| SEO / OG / sitemap incomplete vs launch bar                       | Deferred to Wave 8; tracked under O-01…O-30                                                                                            |

**Final human product sign-off: NOT YET MET.**

---

## `/` — Home

**Current purpose:** Personal identity + Project Worlds atlas + evidence panels.  
**Current visual structure:** Immersive synthwave hero plate; left identity column; right 3-column staggered neon **cards** with island thumbnails; bottom Status / About / Featured panels.  
**What works:** Chrome name, Orbitron/JetBrains, hero-bg plate, island PNG/WebP assets, neon CTAs, reduced-motion hooks, no fake commit telemetry in NestStatus.  
**What fails:** Island art reads as ~88px icons inside ~108px framed links — not floating platforms. Atlas is a card grid over the landscape, not dioramas in the scene. Toolkit appears after Workstation (reference order: Toolkit then Workstation).  
**Incorrect/stale content:** Hero repeats “Solutions Architect” in title + summary. Toolkit count string is hardcoded (acceptable only if single sourced later).  
**Unsupported claims:** None of the old fake `24,731 commits` style metrics on current NestStatus (good).  
**UX:** Desktop atlas competes with identity; worlds feel like a widget.  
**Responsive:** Mobile stacks identity then quote; worlds become interchangeable small cards — mission requires a vertical journey with large art.  
**A11y:** Focus glow present; decorative islands correctly `alt=""`.  
**Performance:** Hero plate is LCP-weighty; island `sizes="88px"` under-fetches relative to needed scale.  
**SEO:** Base route metadata only — OG art / Person JSON-LD incomplete.  
**Priority:** P0 — Wave 1 visual contract.  
**Proposed final composition:** Continuous scene; island platforms **140–240px**; label plates adjacent/above (art not inside frame); network from `relatedWorlds`/`crossLinks`; evidence panels keep real status.  
**Issues:** #86, #20, #85, #88–#97, #319.

---

## `/dotfiles`

**Purpose:** HorneroConfig world.  
**Visual:** SectionLayout hero + narrative + layers + Smart Colors + gallery — still documentation-like vs expanded desktop scene.  
**Fails:** `#galeria` → missing target; `aria-label="Diagrama de capas"` Spanish; large legal/verification block reads as audit report.  
**Content:** 22 rices / Smart Colors pipeline claims need continuous HEAD verification.  
**Priority:** P1 after home gate. **Issues:** #21.

---

## `/agentic-workstation`

**Purpose:** Thin machine / Personal DX graph.  
**Fails:** Public `Epic G` eyebrow; `4 capas` Spanish heading; StackDiagram comment references Epic G; may still soft-link stale harness naming.  
**Visual:** Midnight/cyan/violet language present but LayerCard/doc layout ≠ expanded workstation world.  
**Priority:** P1. **Issues:** #22.

---

## `/agent-toolkit`

**Purpose:** Capability distribution flagship.  
**Works:** Inventory narrative closer to catalogs than early drafts.  
**Fails:** Counts still duplicated as magic strings; not yet a capability-nexus world; Queue vs Swarm must stay sharp in visuals.  
**Priority:** P1. **Issues:** #23.

---

## `/v`

**Purpose:** V scientific / systems ecosystem.  
**Fails risk:** “four libraries…” hero phrasing; unsourced benchmarks; VTL maturity / VSL backends / awesome-v ownership / setup-v pin volatility.  
**Priority:** P1. **Issues:** #24.

---

## `/create-awesome`

**Purpose:** Project factory (Node/Python/V).  
**Fails:** Install/site URL `create-vlang-app.vercel.app` (404); composer completeness (#319); sample vs full catalog counts.  
**Canonical site:** `https://create-awesome-vlang-app.vercel.app`.  
**Priority:** P1. **Issues:** #25.

---

## `/community`

**Purpose:** Contribution gateway.  
**Fails:** `react-vite-starter` nonexistent; governance copy may overclaim (weekly triage, CoC scope); CTA scope vs Create Awesome-only.  
**Priority:** P1. **Issues:** #26.

---

## `/blog`

**Purpose:** Field notes.  
**Works:** Honest empty state possible.  
**Gaps:** External writing/talks underrepresented; Article JSON-LD / RSS when posts exist.  
**Priority:** P2. **Issues:** #27.

---

## `/projects`

**Purpose:** Project ledger vs Worlds atlas — IA overlap.  
**Fails:** Create Awesome marked `archived` as anti-duplication hack; role consistency; stars if hardcoded.  
**Priority:** P1. **Issues:** #28.

---

## `/open-source`

**Purpose:** Contribution evidence.  
**Fails:** Metadata claims generated data; rows still manually authored. Need build-time GitHub sync + editorial overrides.  
**Priority:** P1. **Issues:** #29.

---

## `/404.html`

**Purpose:** Lost-world signal.  
**Gaps:** Confirm SIGNAL LOST / isolated platform composition vs generic Astro 404.  
**Priority:** P2. **Issues:** #30 launch.

---

## Provenance policy (adopted)

| Kind                       | Use                                             |
| -------------------------- | ----------------------------------------------- |
| `CANONICAL_PROJECT_SOURCE` | Current repo HEAD / catalogs                    |
| `PUBLIC_PROFILE_SOURCE`    | Approved profile + public professional presence |
| `GENERATED_GITHUB_SOURCE`  | Build-time GitHub sync                          |
| `EDITORIAL_USER_APPROVED`  | Explicit Ulises approval                        |
| `DERIVED_BUILD_TIME`       | Computed snapshots with commit/date             |

Volatile counts must not be hand-maintained in multiple files.

---

## Backlog stance

| Issue                  | Stance                                 |
| ---------------------- | -------------------------------------- |
| #52                    | CLOSED — art direction locked          |
| #319                   | OPEN — parent for final production     |
| #86                    | OPEN until homepage visual sign-off    |
| #20–#30, #88–#97, #302 | Reconcile with evidence; no mass-close |

---

## Execution sequence (this pass)

1. ~~Production screenshot crawl~~
2. This audit + #319 comment
3. Dangerous factual/link fixes
4. Homepage diorama rebuild (Wave 1)
5. **STOP for human visual acceptance** before propagating world grammar
