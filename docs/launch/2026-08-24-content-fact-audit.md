# Final Content-Fact Audit

**Audit date:** 2026-08-24

**Audited revision:** `main@6f8fc0abb5cd39062f9f616b1090657d38f3a5b2`

**Production:** <https://www.ulises-jeremias.dev/>
**Status:** No unqualified launch claim found; dated source refreshes and owner confirmations remain explicit follow-up work.

## Method

The audit reviewed the canonical route table, project-world registry, profile
mirror, feature data, generated snapshots, route tests, and public destinations.
Volatile metrics are treated as invalid unless they carry a source and
verification date. A fixed snapshot is reported with its commit and date; it is
not described as live data.

## Source Register

| Surface                                         | Source of truth                                                                    | Evidence date or revision                                                              | Result                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Route names, descriptions, canonicals, OG cards | `src/data/routes.ts` and `src/data/site.ts`                                        | `main@6f8fc0ab`                                                                        | Pass; 11 production routes are represented and the canonical host is `www.ulises-jeremias.dev` |
| Home worlds and relationships                   | `src/data/project-worlds.ts`, `src/data/personal-dx-relationships.ts`              | 2026-08-10 for relationship evidence                                                   | Pass; route paths, related-world IDs, and source commits are schema-validated                  |
| Profile, role, location, and contact            | `src/data/profile.ts`, `src/content/profile.yaml`                                  | 2026-08-07                                                                             | Owner confirmation required; these are user-owned claims, not GitHub-generated metrics         |
| HorneroConfig counts and pipeline               | `src/features/dotfiles/data/index.ts`                                              | 2026-08-07                                                                             | Pass as a dated source claim; refresh before a future content release                          |
| Workstation profiles and responsibility split   | `src/features/workstation/data/index.ts`                                           | Source comments and current feature data                                               | Pass; the page states that HorneroConfig is optional and Toolkit owns capabilities             |
| Agent Toolkit inventory                         | `src/features/agent-toolkit/data/inventory.snapshot.json`                          | `v1.8.4`, commit `b6700ca`, 2026-08-07                                                 | Pass as a pinned snapshot; the page exposes provenance and does not claim live counts          |
| V, VSL, VTL, RxV, setup-v                       | `src/features/v/data/index.ts`                                                     | 2026-08-10                                                                             | Pass as a dated source claim; version and role refresh remains scheduled maintenance           |
| Create Awesome catalogs                         | `src/features/create-awesome/data/generated/compatibility.json` and pinned sources | SHA-256 `52fc9c653f6c7af0a0bb5e300a2967af1a0648be3252d727e7ffff7fdf33da8f`, 2026-08-24 | Pass; Node, Python, and V catalog drift was refreshed through PR #375                          |
| Projects ledger                                 | `src/features/projects/data/index.ts`                                              | Entries last verified 2026-08-07 to 2026-08-10                                         | Pass as curated dated evidence; no stars or downloads are asserted                             |
| Open Source evidence                            | `src/data/generated/github-evidence.json` and `src/data/open-source/`              | Seed cache 2026-08-07                                                                  | Pass as explicit evidence rows; volatile metrics are empty by design                           |
| Community registry                              | `src/features/community/data/index.ts`                                             | Static editorial registry                                                              | Pass; no member count or vanity metric is shown, and incubating work is labeled as such        |
| Blog                                            | `src/content/blog/` and `src/content.config.ts`                                    | Empty collection at audit time                                                         | Pass; the empty state is honest and no fabricated post or cadence is claimed                   |

## Claim Controls

- Route descriptions and OG metadata come from one typed route table.
- Agent Toolkit, Dotfiles, and Create Awesome counts are derived from their
  source snapshots rather than retyped in page components.
- Projects and Open Source intentionally omit stars, downloads, and member
  counts unless generated evidence has a verification date.
- The Community page distinguishes Discord conversation from GitHub's durable
  issue and pull-request trail.
- The V page scopes beta, optional, and experimental claims to the relevant
  operation or backend instead of presenting them as universal guarantees.
- The V mascot is a source reference only; no restricted artwork is embedded.
- The empty Blog collection is represented as an empty state and valid RSS, not
  as a fake publishing history.

## Destination Checks

The audit performed authenticated GitHub API checks for the 17 repository
destinations and three Create Awesome organization destinations used by the
site. All repository responses succeeded and reported `archived=false`; the
organization endpoints also returned successfully. HTTP checks returned 200 for
the production site, the three Create Awesome sites, the Discord invite
redirect, and the VSL docs site.

LinkedIn returned HTTP 999 from the audit environment, which is an anti-bot
response rather than evidence of a missing profile. Twitter redirected to the
current X host. LinkedIn remains a manual owner-click check before final
profile sign-off.

## Follow-up Register

| Item                               | Reason                                                                            | Owner action                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Profile role and employment claims | Source mirror is dated and cannot prove current employment or organizational role | Confirm or edit `src/data/profile.ts` and `src/content/profile.yaml`                  |
| Toolkit and Open Source snapshots  | These surfaces intentionally expose pinned evidence rather than live API calls    | Refresh through the documented data workflow before the next content release          |
| V release and role claims          | Upstream projects evolve independently                                            | Reverify versions, maintainer roles, and experimental labels before changing copy     |
| Blog navigation decision           | The collection is empty and product direction is unresolved                       | Keep the honest empty state or remove Blog from primary navigation after owner review |
| LinkedIn destination               | Automated request is blocked by the provider                                      | Confirm the profile manually; do not treat HTTP 999 as a broken link                  |

These items do not invalidate the current launch copy because the site exposes
the relevant dates, source boundaries, or uncertainty. They must not be silently
converted into live or permanent claims.

## Verification

- [x] `astro check` reports zero errors.
- [x] Route and project schemas validate the source registries.
- [x] `data:create-awesome:check` passes with the current snapshot hash.
- [x] `data:create-awesome:drift` reports no catalog, schema, or semantic drift after PR #375.
- [x] Production metadata smoke covers all indexable routes and passes 21/21 checks.
- [x] Main browser quality passes 363/363 checks.
- [ ] Human owner confirmation of profile role and employment claims.
- [ ] Manual LinkedIn click check.

## References

- `src/data/routes.ts`
- `src/data/profile.ts`
- `src/data/project-worlds.ts`
- `src/features/agent-toolkit/data/inventory.snapshot.json`
- `src/features/create-awesome/data/generated/compatibility.json`
- `src/features/dotfiles/data/index.ts`
- `src/features/v/data/index.ts`
- `src/features/projects/data/index.ts`
- `src/data/generated/github-evidence.json`
- Issue [#308](https://github.com/ulises-jeremias/website/issues/308)
