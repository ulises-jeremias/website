# ADR-003 — Portfolio-first information architecture

- **Status**: Accepted
- **Date**: 2026-08-31
- **Deciders**: Ulises Jeremias
- **Scope**: Portfolio evolution — supersedes the flat world taxonomy as the primary visitor model
- **Related**: Issue #392, #393, #394, #395, #396, #397, #398, #399, #400, #401, #402, #403, #404, #405
- **Supersedes**: ADR-001 route priority ordering (the route paths remain canonical); the flat `projectWorlds` classification as the sole portfolio taxonomy
- **Extends**: ADR-002 subdomain boundary (still in force; no subdomain split)

## Context

The website launched with a ten-route Digital Nest model where every project, editorial route, community surface, catalog, and evidence view was a peer "world". This is visually distinctive but makes the portfolio harder to scan than it should be: visitors must understand the internal world taxonomy before understanding Ulises and his work.

The goal is to reorganize the site around four flagship bodies of work while preserving the Digital Nest identity as a secondary exploration experience.

## Decision

### Four flagship portfolio areas

1. **Agentic Developer Stack** — Agent Toolkit (capabilities/runtime), Agentic Workstation (machine provisioning), Agentic Harness (persistent workspace). One family, three composable responsibilities.
2. **HorneroConfig** — reproducible Linux developer environment (`ulises-jeremias/dotfiles`).
3. **V Ecosystem** — V compiler contributions, VSL, VTL, RxV, setup-v, Awesome V.
4. **Create Awesome** — composable app scaffolding across Node, Python, and V.

### Route map

| Path                   | Public label   | Purpose                                                                                                           | Tier                | Canonical       |
| ---------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------- | --------------- |
| `/`                    | Home           | Identity, featured work, current focus, evidence, selected work, writing, About preview, Digital Nest exploration | Home                | Yes             |
| `/agentic`             | Agentic        | Agentic Developer Stack overview — three responsibilities, adoption paths, demo link                              | Flagship area       | **New**         |
| `/agent-toolkit`       | Agent Toolkit  | Toolkit capabilities/runtime detail                                                                               | Flagship detail     | Yes (preserved) |
| `/agentic-workstation` | Workstation    | Machine provisioning detail                                                                                       | Flagship detail     | Yes (preserved) |
| `/agentic-harness`     | Harness        | Persistent workspace detail                                                                                       | Flagship detail     | Yes (preserved) |
| `/dotfiles`            | HorneroConfig  | Reproducible Linux environment                                                                                    | Flagship detail     | Yes (preserved) |
| `/v`                   | V Ecosystem    | V compiler, VSL, VTL, RxV, setup-v, Awesome V                                                                     | Flagship detail     | Yes (preserved) |
| `/create-awesome`      | Create Awesome | Scaffolding family                                                                                                | Flagship detail     | Yes (preserved) |
| `/projects`            | Work           | Visitor-oriented portfolio: featured, maintained ecosystems, selected work, labs, ledger                          | Primary destination | Yes (preserved) |
| `/open-source`         | Open Source    | Evidence for ownership, maintenance, contributions                                                                | Primary destination | Yes (preserved) |
| `/about`               | About          | Builder trajectory, values, roles, contact                                                                        | Primary destination | **New**         |
| `/blog`                | Writing        | Technical journal (secondary while empty)                                                                         | Secondary           | Yes (preserved) |
| `/community`           | Community      | Cross-cutting contribution/discord hub                                                                            | Secondary           | Yes (preserved) |

### Public labels vs canonical URLs

- `Work` is the navigation label for `/projects`. No URL change, no redirect.
- `Writing` is the navigation label for `/blog`. No URL change, no redirect.
- `HorneroConfig` is the public product name for the `/dotfiles` route. No URL change.
- `/work`, `/writing`, and `/hornero-config` aliases are **not** created. If external-link demand emerges, a future decision will add redirects with canonical migration evidence.
- `/agentic` and `/about` are new canonical routes. No child route redirects to them.

### Navigation hierarchy

Primary navigation (desktop and mobile):

- Brand → Home
- Work → `/projects`
- Open Source → `/open-source`
- About → `/about`
- GitHub (external CTA)

Secondary/footer navigation: Writing, Community, Agentic, HorneroConfig, V Ecosystem, Create Awesome, Agent Toolkit, Workstation, Harness, Digital Nest exploration.

Promotion rule for Writing: moves from secondary to primary after the first published post (or an explicit owner decision). See #396.

### Digital Nest repositioning

Digital Nest remains the visual identity and an optional exploration experience. It appears on the homepage after the personal/featured-work hierarchy. The Project Atlas and world illustrations are preserved but do not serve as the required mental model for understanding the portfolio.

### Superseded records

| Record                                                 | Disposition                                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `ADR-001` route paths                                  | **Preserved** — all existing canonical URLs remain unchanged                       |
| `ADR-001` world priority ordering                      | **Superseded** — portfolio areas replace flat world ordering for visitor hierarchy |
| `route-redesign-plan-2026-08.md` route set             | **Amended** — `/agentic` and `/about` added; flat world ordering replaced          |
| `docs/design/synthwave-systems-atlas.md` art direction | **Preserved** — Digital Nest remains the exploration layer                         |
| ADR-002 subdomain boundary                             | **Preserved** — no subdomain split in this evolution                               |

### Accessibility and responsive requirements

The IA must work as plain textual navigation without maps, hover, color, or motion. Desktop and mobile expose the same destination hierarchy with different composition only where needed. Every added route defines canonical metadata, sitemap behavior, structured data, and an indexability decision.

### Performance constraints

Preserve Astro static output and current route budgets. The IA decision does not require a client framework or live API. New routes are measured before budgets are set; thresholds are not raised merely to pass CI.

## Consequences

- **Positive**: visitors understand the portfolio without decoding internal terminology; flagship areas are scannable; existing URLs and SEO investment are preserved.
- **Negative**: the header no longer lists every world; Community and Blog become less prominent (intentional); the world taxonomy needs a companion portfolio layer.
- **Neutral**: Digital Nest content is unchanged; only its placement changes.

## Validation

- [x] Route table covers every existing canonical path plus the two new routes.
- [x] Work and Open Source have distinct purposes.
- [x] Writing has a documented empty-content prominence policy.
- [x] Community is secondary and cross-cutting, not removed.
- [x] Digital Nest is the exploration layer, not removed.
- [x] Ownership vocabulary distinguishes author, maintainer, organization work, contributor, and external ecosystem.
- [x] ADR-001 and the route redesign plan are explicitly dispositioned.
- [x] No subdomain or deployment split is required.

## References

- [ADR-001 — Route map and naming](./ADR-001-route-map.md)
- [ADR-002 — v1.1 and subdomain boundary](./ADR-002-v1-1-and-subdomain-boundary.md)
- [docs/design/synthwave-systems-atlas.md](../design/synthwave-systems-atlas.md)
- [Issue #392](https://github.com/ulises-jeremias/website/issues/392)

## History

| Date       | Change                                            |
| ---------- | ------------------------------------------------- |
| 2026-08-31 | Initial acceptance — portfolio-first IA validated |
