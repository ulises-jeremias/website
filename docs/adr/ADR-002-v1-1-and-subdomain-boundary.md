# ADR-002 - v1.1 and subdomain boundary

- **Status**: Accepted for the v1 launch boundary
- **Date**: 2026-08-24
- **Deciders**: Ulises Jeremias
- **Scope**: Digital Nest launch and post-launch evolution
- **Related**: Issue #311, `src/data/routes.ts`, `src/data/project-worlds.ts`
- **Supersedes**: None; extends the route strategy in ADR-001

## Context

Digital Nest now ships eleven public routes from one Astro static deployment at
`https://www.ulises-jeremias.dev`. The route redesign intentionally keeps each
world as a direct path while storing optional subdomain hints in typed route and
world metadata. Moving a world to a separate host would affect DNS, redirects,
canonical URLs, assets, deployment ownership, search indexing, and support.

The launch needs a clear boundary so a subdomain idea does not expand the v1
release or turn post-launch feedback into unbounded platform work.

## Options Considered

### Option A: Keep the apex route map for v1 and gate migration on evidence

**Pros:**

- Preserves the current canonical URLs and shared shell.
- Avoids DNS, redirect, cache, and duplicate-indexing risk during launch.
- Keeps one deployment and one content-fact refresh process.
- Uses the existing `path` and optional `subdomain` fields without prematurely splitting ownership.

**Cons:**

- High-growth worlds remain on the shared host.
- A future migration will require a dedicated redirect and canonical rollout.

### Option B: Move priority worlds to subdomains now

**Pros:**

- Gives Dotfiles or Blog a standalone address immediately.
- Allows independent host-level deployment and branding later.

**Cons:**

- Adds launch-time DNS, redirect, asset-host, and SEO work without measured demand.
- Increases the chance of broken external links and split ownership.
- Would distract from the unresolved human acceptance and feedback gates.

### Option C: Hide worlds behind nested catalog routes

**Pros:**

- One catalog host and a simpler top-level host list.

**Cons:**

- Breaks the direct top-level route strategy already accepted in ADR-001.
- Makes future path-preserving subdomain migration less clear.
- Weakens external links and project-world discoverability.

## Decision

Choose Option A.

For v1, the canonical deployment remains `www.ulises-jeremias.dev`, and the
current top-level paths remain canonical. No subdomain is created as part of the
launch or the default v1.1 scope. Existing `subdomain` values are planning
metadata only and must not change canonical output by themselves.

If a world later moves, the migration must preserve the path contract, issue a
301 from the old path to the new host, emit one canonical host per page, retain
or explicitly redirect asset paths, and pass a dedicated production smoke and
link audit. A migration is a new implementation decision, not an automatic
consequence of this ADR.

## v1.1 Boundary

The default v1.1 scope includes:

- Human screen-reader, zoom, contrast, device, and visual acceptance evidence.
- Content-fact refreshes for dated snapshots and owner confirmation of profile claims.
- Feedback-backed fixes from the post-launch process.
- A Blog navigation and publishing decision based on owner review.
- A migration spike only when the evidence gate below is satisfied.

The default v1.1 scope excludes:

- DNS, subdomain redirects, or a second production deployment.
- A route hierarchy rewrite or another broad visual redesign.
- React, WebGL, animation frameworks, hidden analytics, or vanity metrics.
- Live GitHub metrics without a verified refresh and privacy decision.
- New project worlds that are not supported by a reviewed source and owner.

## Migration Evidence Gate

Before proposing a world migration, record all of the following in a new issue
and implementation plan:

- A demonstrated audience, content, or release need that the shared host cannot serve well.
- A stable owner and publishing or release cadence for the candidate world.
- A measured operational benefit, such as independent deploys or materially different performance requirements.
- A path-preserving redirect, canonical, sitemap, asset, and rollback plan.
- A link audit for GitHub, npm, AUR, RSS, social cards, and cross-world references.
- Owner approval after production preview and human accessibility review.

## Consequences

- Launch remains small, reversible, and compatible with the accepted route map.
- The `subdomain` metadata records intent without creating an accidental SEO contract.
- Post-launch feedback can prioritize human and content evidence before platform extraction.
- A future migration carries explicit redirect, asset, and canonical work instead of relying on assumptions.

## References

- `docs/adr/ADR-001-route-map.md`
- `docs/design/current/route-redesign-plan-2026-08.md`
- `src/data/routes.ts`
- `src/data/project-worlds.ts`
- `docs/launch/2026-08-24-launch-checklist.md`
- `docs/launch/2026-08-24-post-launch-feedback.md`
- Issue [#311](https://github.com/ulises-jeremias/website/issues/311)
