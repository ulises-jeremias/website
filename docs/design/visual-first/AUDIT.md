# Visual-first production audit

**Date:** 2026-08-09
**Production:** https://www.ulises-jeremias.dev
**Branch capture context:** `feat/visual-first-agent-toolkit` (audit of live production, pre-prototype)
**Viewports:** 1440×1000 and 390×844 (viewport screenshots under `docs/design/visual-first/audit/{route}/`)
**Word metric (canonical):** approximate **visible** words excluding header/footer, `aria-hidden`, and closed `<details>` (see `audit/_metrics.json`). Alternate main-only scrape also stored in `audit/metrics.json`.

## Principle under test

Website = interactive trailer / conceptual map.
Repository + Wiki + docs/ = detailed manual.
One concept = one primary teaching device. Layers 0–2 emphasized.

---

## Summary table

| Route                  | Visible words | Prose paras | Lists / items | Diagrams | Cards | Density verdict                                      |
| ---------------------- | ------------: | ----------: | ------------: | -------: | ----: | ---------------------------------------------------- |
| `/`                    |           381 |           4 |        3 / 15 |       0* |     0 | Acceptable for atlas; keep diorama priority          |
| `/dotfiles`            |          1093 |          22 |        8 / 26 |        1 |    22 | High prose + card tiles; Smart Colors already visual |
| `/agentic-workstation` |          2274 |          53 |       14 / 59 |        2 |   102 | Worst duplication; graph + cards + lists             |
| `/agent-toolkit`       |          1662 |          34 |      21 / 105 |        3 |     7 | Repeated stats/panels; P0 prototype target           |
| `/v`                   |          2207 |          38 |       17 / 52 |        5 |    94 | Lab diagrams exist but buried in prose/cards         |
| `/create-awesome`      |          2169 |          18 |        8 / 43 |        0 |     0 | Composer + repeated family essays                    |
| `/community`           |          1515 |          59 |       17 / 63 |        1 |    31 | Umbrella correct; too many paragraphs                |
| `/blog`                |            51 |           4 |         0 / 0 |        0 |     0 | Fine empty journal                                   |
| `/projects`            |           366 |          14 |         1 / 5 |        0 |     0 | Compact ledger — mostly OK                           |
| `/open-source`         |           226 |           4 |        2 / 10 |        1 |     0 | Compact evidence — mostly OK                         |
| `/404.html`            |            28 |           1 |         0 / 0 |        0 |     0 | Fine                                                 |

\*Home diorama uses CSS/image composition; SVG count may under-report.

---

## `/` — Home

- **Approx visible words:** 281
- **Prose paragraphs:** 4
- **Cards / lists:** 0 cards · 3 lists
- **Diagrams / visual interactions:** floating world diorama (primary)
- **Primary concept:** Digital Nest atlas of project worlds
- **Primary CTA:** enter a world island / navigate atlas

| Class                  | Items                                                |
| ---------------------- | ---------------------------------------------------- |
| TEXT → VISUAL          | Evidence panel bullets that restate island meanings  |
| TEXT DUPLICATES VISUAL | Nest status rows that repeat atlas labels            |
| TEXT → DOCS            | Deep profile positioning essays                      |
| TEXT REMOVE            | Any leftover implementation/audit voice              |
| TEXT MUST REMAIN       | Brand, one headline, short supporting sentence, CTAs |

---

## `/dotfiles`

- **Approx visible words:** 749
- **Prose paragraphs:** 22
- **Cards / lists:** 22 cards · 8 lists
- **Diagrams / visual interactions:** layers diagram + Smart Colors animation + screenshot gallery
- **Primary concept:** HorneroConfig nest / Smart Colors pipeline
- **Primary CTA:** explore gallery / GitHub

| Class                  | Items                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------- |
| TEXT → VISUAL          | Layer explanations already partly diagrammed; keep teaching via gallery + Smart Colors |
| TEXT DUPLICATES VISUAL | “Wallpaper → Material → Scheme → Consumers” prose next to the same pipeline UI         |
| TEXT → DOCS            | chezmoi/script inventory detail                                                        |
| TEXT REMOVE            | Repeated “live stack” paragraphs                                                       |
| TEXT MUST REMAIN       | Brand, one-sentence purpose, screenshot captions, install one-liner                    |

---

## `/agentic-workstation`

- **Approx visible words:** 2003
- **Prose paragraphs:** 53
- **Cards / lists:** 102 cards · 14 lists
- **Diagrams / visual interactions:** ecosystem/stack SVGs exist but lose to card walls
- **Primary concept:** Personal DX graph (L1 → L1.5 → L2)
- **Primary CTA:** install uplink / open Toolkit

| Class                  | Items                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| TEXT → VISUAL          | Profile selector + Toolkit uplink + Harness station should be one interactive map |
| TEXT DUPLICATES VISUAL | Graph narrative restated as cards, lists, and code blocks                         |
| TEXT → DOCS            | LLM policy, runner internals, chezmoi runbooks                                    |
| TEXT REMOVE            | Duplicate “graph not ladder” explanations                                         |
| TEXT MUST REMAIN       | Layer labels, one install command, honest scope (thin L1)                         |

---

## `/agent-toolkit` (P0)

- **Approx visible words:** 1662 (canonical `_metrics.json`)
- **Prose paragraphs:** 34
- **Cards / lists:** 7 cards · 21 lists / 105 items
- **Diagrams / visual interactions:** anatomy SVG, distribution map, swarm rail (underpowered vs prose)
- **Primary concept:** One source catalog → many assistants; Swarm ≠ Queue
- **Primary CTA:** install / explore GitHub / community

| Class                  | Items                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| TEXT → VISUAL          | Capability families, distribution fan-out, queue vs swarm, recipe topologies, Herdr/tmux, budgets, governance |
| TEXT DUPLICATES VISUAL | Stats strip + hero strip + family tabs + domain list + distribution source list (same counts 3–5×)            |
| TEXT → DOCS            | Example skill descriptions, full CLI lists, budget variable glossary, state-file inventory                    |
| TEXT REMOVE            | Overview triad (“principle / layers / delivery”), duplicate swarm stage cards under the rail                  |
| TEXT MUST REMAIN       | Short title + one sentence, live counts from inventory, docs/GitHub deep links, provenance                    |

**Target after P0:** −60% to −75% visible prose (≈415–665 words) while teaching more via Operations Room interactions.
**Measured after (prototype):** **338** words (−79.7%) — see `toolkit-gate/WORD-COUNT.md`.

Screenshots: `audit/agent-toolkit/{1440,390}.png`

---

## `/v`

- **Approx visible words:** 1738
- **Prose paragraphs:** 38
- **Cards / lists:** 94 cards · 17 lists
- **Diagrams / visual interactions:** several scientific diagrams (underused)
- **Primary concept:** V computational ecosystem (language + labs)
- **Primary CTA:** station GitHub links

| Class                  | Items                                                          |
| ---------------------- | -------------------------------------------------------------- |
| TEXT → VISUAL          | Autograd, RxV stream, setup-v CI conveyor                      |
| TEXT DUPLICATES VISUAL | Overview cards + station essays + diagram legends              |
| TEXT → DOCS            | Claim-verification / internal audit copy                       |
| TEXT REMOVE            | Six generic cards if stations replace them                     |
| TEXT MUST REMAIN       | Station labels, maturity badges, license/provenance disclosure |

---

## `/create-awesome`

- **Approx visible words:** 2020
- **Prose paragraphs:** 18
- **Cards / lists:** 0 cards · 8 lists
- **Diagrams / visual interactions:** Composer (primary)
- **Primary concept:** One composition model across CNA/CPA/CVA
- **Primary CTA:** copy composed command

| Class                  | Items                                                         |
| ---------------------- | ------------------------------------------------------------- |
| TEXT → VISUAL          | Family assembly-line around Composer                          |
| TEXT DUPLICATES VISUAL | Hero + mini factory + three variant essays + comparison table |
| TEXT → DOCS            | Full distribution matrix                                      |
| TEXT REMOVE            | Repeated “one command any stack” blocks                       |
| TEXT MUST REMAIN       | Composer UI, live command, honest catalog counts              |

---

## `/community`

- **Approx visible words:** 1178
- **Prose paragraphs:** 59
- **Cards / lists:** 31 cards · 17 lists
- **Diagrams / visual interactions:** workshop map light
- **Primary concept:** Digital Nest umbrella workshop
- **Primary CTA:** Discord + GitHub contribution

| Class                  | Items                                                |
| ---------------------- | ---------------------------------------------------- |
| TEXT → VISUAL          | Family stations on one workshop map                  |
| TEXT DUPLICATES VISUAL | Cross-pollination paragraphs + family card walls     |
| TEXT → DOCS            | Contribution process detail                          |
| TEXT REMOVE            | Repeated Discord/GitHub role essays                  |
| TEXT MUST REMAIN       | Scope (umbrella), Discord invite, incubating honesty |

---

## `/blog`

- **Approx visible words:** 44
- **Primary concept:** field notes journal
- **Primary CTA:** none / wait for posts
- Mostly fine — minor visual-first only.

---

## `/projects`

- **Approx visible words:** 234
- **Primary concept:** world islands + ledger
- Compact; avoid re-expanding into cards.

---

## `/open-source`

- **Approx visible words:** 135
- **Primary concept:** evidence ledger
- Compact; constellation polish later (P2).

---

## `/404.html`

- **Approx visible words:** 24
- Fine.

---

## Cross-cutting findings

1. **Highest prose density:** Create Awesome, Workstation, V, Community, Toolkit.
2. **Repeated representation pattern:** paragraph + list + diagram + legend for the same concept.
3. **Inventory truth is solid on Toolkit** (v1.8.4 / b6700ca) — keep data layer; change presentation only.
4. **Do not hide 5k words in `<details>`** — move manuals to repo/docs links.
5. **P0 proof route:** `/agent-toolkit` Agent Operations Room (human gate required before propagating pattern).
