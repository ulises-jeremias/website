# Digital Nest route redesign plan

**Date:** 2026-08-24
**Baseline:** `main@b56dbf03`
**Direction:** Synthwave Systems Atlas
**Delivery:** route-specific waves through protected pull requests

> **Amended 2026-08-31:** ADR-003 (`docs/adr/ADR-003-portfolio-first-ia.md`)
> supersedes the flat world priority ordering as the visitor hierarchy and adds
> `/agentic` and `/about` to the route set. All canonical URLs from this plan
> remain preserved. The route-specific wave work described here is complete.

## Intent

The first route-identity pass corrected content, spacing, and obvious density
problems, but six world routes still share the same visual cadence. This pass
changes the composition of every public route while preserving the approved
Digital Nest shell, source-of-truth data, native HTML controls, and static Astro
delivery.

The shell is shared. The page is not. Each route must have one dominant surface
that comes from its subject: a desktop cockpit, a provisioning chassis, a
capability console, a laboratory bench, an assembly line, a workshop plaza, an
editorial desk, an evidence ledger, an archive, a recovery atlas, or the main
observatory.

## Route directions

| Route                   | Dominant surface            | Signature interaction or artifact                   |
| ----------------------- | --------------------------- | --------------------------------------------------- |
| `/`                     | Atlas observatory           | Connected floating project worlds in the landscape  |
| `/dotfiles/`            | Configuration cockpit       | Wallpaper → palette → desktop consumer pipeline     |
| `/agentic-workstation/` | Provisioning chassis        | Boot stages illuminate the machine responsibilities |
| `/agent-toolkit/`       | Orchestration console       | Capability families distribute into native profiles |
| `/v/`                   | Computational laboratory    | Station index selects a distinct instrument         |
| `/create-awesome/`      | Assembly line and workbench | Generated command is the visible output artifact    |
| `/community/`           | Shared workshop plaza       | Neighborhood selection routes participation         |
| `/blog/`                | Technical field journal     | Publication contract and readable writing column    |
| `/projects/`            | Case-study archive          | World pointers transition into an evidence ledger   |
| `/open-source/`         | Provenance ledger           | Four contribution kinds explain the constellation   |
| `/404.html`             | Signal recovery atlas       | Canonical world directory is the recovery action    |

## Waves

### A — Personal DX

Redesign Dotfiles, Agentic Workstation, and Agent Toolkit without changing the
homepage. The routes receive different outer compositions, stronger subject
framing, and explicit surface treatments at their active feature roots.

### B — Technical ecosystems

Redesign V and Create Awesome around a laboratory bench and a real assembly-line
workbench. Preserve hashes, static station indexes, compatibility data, and
no-JavaScript content.

### C — Workshop and editorial

Redesign Community and Blog so their visual language no longer resembles a
technical stage. Keep contribution routing, RSS, empty-state honesty, and
privacy language intact.

### D — Archive and recovery

Redesign Projects, Open Source, and 404 around archive reading, provenance, and
fast recovery rather than generic cards or atmospheric voids.

### E — Observatory closure

Revisit Home after the other worlds are distinct. Preserve the project-first
orientation and use the final route set to tune the atlas connections, world
labels, and responsive landscape without turning the homepage into a directory.

## Constraints

- Keep `SectionLayout`, `BaseLayout`, `SiteHeader`, `MobileNav`, and `SiteFooter`.
- Keep Astro static output, CSS, SVG, and small route-local scripts.
- Do not add React, animation frameworks, WebGL, fake telemetry, or unverified facts.
- Preserve `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md` for informative/decorative SVGs.
- Preserve native controls, no-JavaScript fallbacks, reduced-motion behavior,
  focus visibility, and 320px reflow.
- Use existing tokens for semantic UI chrome; keep literal SVG colors only when
  they are part of an intentional illustration palette.
- Do not update maintained screenshots blindly. Capture the changed routes,
  inspect the rendered composition, then update only the approved route goldens.

## Evidence contract

Each wave records:

- changed route and feature roots;
- desktop `1440px` and mobile `390px` captures;
- route smoke, semantic, reduced-motion, and reflow results;
- `pnpm test`, `pnpm build`, `pnpm performance:check`, and Lighthouse status;
- any route-budget delta with its reason.

The repository owner has explicitly authorized implementation of this redesign.
The remaining manual assistive-technology and visual sign-off records are not a
stop condition for this engineering pass, but the implementation must not claim
those human validations were performed.
