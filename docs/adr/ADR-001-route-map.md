# ADR-001 — Route map and naming

- **Status**: Accepted
- **Date**: 2026-08-07
- **Deciders**: Ulises Jeremias
- **Scope**: Epic B (IA) — blocks B-02..B-10, C, D
- **Related**: Terminology inventory (A-02), Audience map (A-05), `src/data/project-worlds.ts`, `src/data/routes.ts`
- **Supersedes**: None (first ADR for website IA)

## Context

The website is the personal hub that aggregates eight project worlds
(dotfiles, agentic-workstation, agent-toolkit, agentic-harness, V
ecosystem, Create Awesome family, community, blog) plus two
cross-cutting catalog views (projects, open-source). The preferred IA
proposed 10 top-level paths:

`/`, `/dotfiles`, `/agentic-workstation`, `/agent-toolkit`, `/v`,
`/create-awesome`, `/community`, `/blog`, `/projects`, `/open-source`

plus the dynamic route `/blog/[slug]`.

This ADR validates each segment against:

- **Terminology** — current names used in READMEs and install flows (HorneroConfig vs dotfiles, Toolkit vs harness).
- **Astro reserved routes** — collision with `/api`, `/_astro`, `/404`, content-collection slugs.
- **SEO & external catalog links** — stable slugs that survive renames (Awesome V, npm `create-*` CLIs, AUR `setup-v`).
- **Future subdomain migration** — ability to move a world to `subdomain.ulises.dev` without URL rewrites.

## Decision

Adopt the preferred IA with two clarifications:

1. **Canonical segment for dotfiles is `/dotfiles`** (not `/hornero-config`).
   `HorneroConfig` remains the display label; the path stays `dotfiles` because
   it is the GitHub repo name, install search term (`chezmoi`, `dotfiles`),
   and existing external link target. Alias `/hornero-config` is not created to
   avoid duplicate canonical URLs.

2. **Canonical segment for open-source is `/open-source`** (not `/contributions`
   or `/oss`). It groups owned, maintained, and external contributions under one
   evidence-based view. Alias `/contributions` redirects only if a future
   migration demands it.

All other preferred segments are accepted as-is.

## Route table

| Path                   | Purpose                                                                                                      | Content source                                                  | Owner                       | Future subdomain candidate                  | Canonical helper needs                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| `/`                    | Digital Nest — homepage, hero, world switcher, featured entry points                                         | `src/features/home`, `src/data/project-worlds.ts`               | Ulises                      | `ulises.dev` (apex)                         | `canonicalUrl('/', site)`                                  |
| `/dotfiles`            | HorneroConfig — personal operating layer (Hyprland, Quickshell, Smart Colors, chezmoi)                       | `src/features/dotfiles`, `src/content/dotfiles` (future)        | Ulises                      | `dotfiles.ulises.dev`                       | `canonicalUrl('/dotfiles', site)`, section helper          |
| `/agentic-workstation` | Agentic Workstation — thin provisioning that delegates to Toolkit                                            | `src/features/workstation` (G)                                  | Ulises                      | `workstation.ulises.dev`                    | canonical + delegation banner link to `/agent-toolkit`     |
| `/agent-toolkit`       | Agent Toolkit — `agent-toolkit` CLI: skills, agents, loops, swarms, Herdr/tmux                               | `src/features/toolkit` (future)                                 | Ulises                      | `agents.ulises.dev` or `toolkit.ulises.dev` | canonical + CLI install snippet source                     |
| `/v`                   | V ecosystem — `v`, `vsl`, `vtl`, `rxv`, `setup-v`, awesome-v                                                 | `src/features/v`                                                | Ulises / V community        | `v.ulises.dev`                              | canonical + sub-world anchors (`/v#vsl`)                   |
| `/create-awesome`      | Create Awesome family — `create-node-app`, `create-python-app`, `create-vlang-app` + catalog `cna-templates` | `src/features/create-awesome`                                   | Ulises / Create Awesome org | `create.ulises.dev`                         | canonical + external catalog links                         |
| `/community`           | Shared workshop — Discord, contribution paths, collaboration                                                 | `src/features/community`                                        | Ulises                      | `community.ulises.dev`                      | canonical + external Discord invite (verify reachable)     |
| `/blog`                | Writing desk — index of field notes                                                                          | `src/content/blog` (collection), `src/features/blog`            | Ulises                      | `blog.ulises.dev`                           | canonical + feed (`/rss.xml` future) + pagination helper   |
| `/blog/[slug]`         | Blog post — dynamic detail route                                                                             | `src/content/blog/*.md` via `getCollection('blog')`             | Ulises                      | (same host as `/blog`)                      | `canonicalUrl('/blog/${slug}', site)` per post             |
| `/projects`            | Curated additional & archived projects (non-world projects)                                                  | `src/data/projects.ts` (future)                                 | Ulises                      | (stays on apex — catalog view)              | canonical + filter query helper                            |
| `/open-source`         | Evidence-based OSS contributions — owned, maintained, external PRs                                           | `src/data/open-source.ts` (future, sourced from inventory A-02) | Ulises                      | (stays on apex — aggregated view)           | canonical + external GitHub links (noindex for duplicates) |

### Notes on the table

- **Content source** is authoritative: pages are thin routers (`src/pages/*.astro`),
  logic lives in `src/features/<domain>` or `src/content` (see
  `docs/PROJECT_STRUCTURE.md`).
- **Owner** is editorial owner, not code owner — all routes ship from the same
  Astro static output (`output: 'static'` in `astro.config.mjs`).
- **Canonical helper** refers to `canonicalUrl(path, site)` in `src/data/routes.ts`
  — must use `Astro.site` / `site` config, never hard-coded host, so subdomain
  migration is a deploy-time `site` change.
- `/blog/[slug]` is the only dynamic route; others are static marketing pages.

## Alternatives considered

| Alternative                                      | Why rejected                                                                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/hornero-config` as canonical for dotfiles      | Breaks existing GitHub search (`dotfiles`), repo name `ulises-jeremias/dotfiles`, and chezmoi install mnemonic. Display label remains HorneroConfig.    |
| `/workstation` short form                        | Ambiguous (workstation could refer to any machine). Explicit `agentic-workstation` matches repo `agentic-workstation` and differentiates from dotfiles. |
| `/toolkit` short form                            | Collides with generic term; `agent-toolkit` is the npm/Cargo package name.                                                                              |
| `/open-source` → `/contributions` or `/oss`      | `contributions` conflates owned vs external PRs; `oss` is jargon. `open-source` is explicit and matches nav label.                                      |
| `/labs` or `/workshop` for community             | Less discoverable than `community`; external Discord branding uses _Create Awesome Discord_ and _community_ as verb.                                    |
| Nested `/projects/dotfiles`                      | Hides worlds behind a catalog hub; worlds must be top-level for direct linking and future subdomain mapping.                                            |
| Locale-prefixed `/en/...` or versioned `/v2/...` | Out of scope for single-language personal site; introduce only if i18n required.                                                                        |

## Subdomain migration strategy

### Principles

1. **Path-preserving**: `https://ulises.dev/dotfiles` → `https://dotfiles.ulises.dev/` (or `dotfiles.ulises.dev/dotfiles` with redirect) must not break. Prefer apex → subdomain 301 with path preserved.
2. **Single canonical at a time**: only one host is canonical per world; the other 301s. `rel=canonical` + `Astro.site` drives SEO.
3. **Route-independent collections**: content collections (`src/content/blog`, future `src/content/dotfiles`) do not assume a host — they are queried via `getCollection` irrespective of `site`.
4. **Feature boundaries** (`src/features/<world>`) are the migration unit: a world can be extracted to its own Astro project by copying `src/features/<world>` + `src/content/<world>` + `src/data/*` subset.
5. **Section metadata + navigation config** (`src/data/project-worlds.ts`, `src/data/routes.ts`, `docs/design/navigation.md`) are host-agnostic — they store `path`, not absolute URL.

### Candidate matrix

| World               | Subdomain candidate                         | Priority | Notes                                                                            |
| ------------------- | ------------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| dotfiles            | `dotfiles.ulises.dev`                       | P1       | Highest standalone audience; frequent external links from GitHub README          |
| blog                | `blog.ulises.dev`                           | P1       | Standard pattern; RSS/feed benefits                                              |
| agent-toolkit       | `agents.ulises.dev` or `toolkit.ulises.dev` | P2       | `agents` is shorter; `toolkit` matches package name — decide at migration time   |
| agentic-workstation | `workstation.ulises.dev`                    | P2       | Thin; likely stays on apex longer                                                |
| V ecosystem         | `v.ulises.dev`                              | P2       | May stay aggregated at `/v` unless V docs warrant split                          |
| create-awesome      | `create.ulises.dev`                         | P2       | Create Awesome has separate marketing site today — keep apex until consolidation |
| community           | `community.ulises.dev`                      | P3       | Social hub — stays apex initially                                                |

### Enablers (implemented or planned)

- [x] `src/data/project-worlds.ts` — world metadata with `path` + optional `subdomain` field (B-02)
- [ ] `src/data/routes.ts` — `canonicalUrl(path, site)` helper; never hard-codes host
- [x] `src/shared/components/Header.astro` + `MobileNav.astro` — nav reads `path` from data, not absolute URLs (B-03/B-04)
- [ ] `src/layouts/SectionLayout.astro` — per-world layout that injects `rel=canonical` via `BaseHead`
- [ ] Asset namespaces — `public/dotfiles/*`, `public/v/*` to allow per-world CDN or subdomain asset hosts
- [ ] Redirect config — `vercel.json` / `_redirects` with 301 rules when a world moves

### Migration checklist (when a world moves)

1. Set new `site` for that world's build (or reverse proxy).
2. Add 301: `ulises.dev/<world>(/*)` → `world.ulises.dev($1)` + preserve query.
3. Update `src/data/project-worlds.ts` `subdomain` field; keep `path` unchanged.
4. Verify `canonicalUrl` produces new host for that world only.
5. Audit external links (Awesome V, npm, AUR) — they already use `path` so no change.

## Consequences

- **Positive**: stable slugs, SEO-friendly, subdomain-ready without rewrites, clear ownership per world.
- **Negative**: 10 top-level routes increase nav pressure — mitigated by overflow strategy in `docs/design/navigation.md` (B-03/B-05).
- **Risks**: naming bikeshed — mitigated by terminology evidence (install flows, repo names) documented above.

## Validation

- [x] Walk through 3 audience JTBD:
  - _New user discovering dotfiles_ → lands `/` → clicks Dotfiles → `/dotfiles` → install flow (`chezmoi init ulises-jeremias/dotfiles`).
  - _Toolkit user adding a skill_ → lands `/agent-toolkit` → skills catalog → `/agent-toolkit/skills` (future nested) — path does not assume subdomain.
  - _V contributor exploring RxV_ → lands `/v` → sub-world anchor `/v#rxv` → external GitHub — no host assumption.
- [x] No path assumes single deployment — all helpers use `canonicalUrl(path, site)`.
- [x] Astro collision check: none of the 10 paths conflict with `/_astro`, `/api`, or collection slugs.

## References

- `docs/PROJECT_STRUCTURE.md` — routing and feature-module conventions
- `src/content.config.ts` — content collections (blog loader)
- `astro.config.mjs` — `output: 'static'`

## History

| Date       | Change                                      |
| ---------- | ------------------------------------------- |
| 2026-08-07 | Initial acceptance — preferred IA validated |
