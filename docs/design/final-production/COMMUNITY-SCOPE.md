# Community scope correction — 2026-08-07

`/community` is the **Digital Nest umbrella workshop**, not a Create Awesome community.

## Product truth

- Discord invite verified: `https://discord.gg/bR5VyATgka` → `discord.com/invite/bR5VyATgka` (200)
- Create Awesome (Node / Python / V) is one family inside the workshop
- Active stations include HorneroConfig, Agentic Workstation, Agentic Harness, Agent Toolkit, Create Awesome, and relevant V ecosystem work (roles project-specific)
- Incubating (editorial, no URLs): Skypiea-Home, HorneroOS, unnamed agent workspace experiment
- No invented Discord channels, weekly triage schedule, universal CoC, or website-issues-as-default CTA

## Extensibility

Add a project to the workshop by appending a `communityProjects` entry with `communityEnabled: true` in `src/features/community/data/index.ts` (Zod-validated). Incubating ideas use `incubatingProjects` with `public: true` only.

## Related copy synced

- `src/data/routes.ts` community SEO description
- `src/data/project-worlds.ts` Community island description + cross-links
