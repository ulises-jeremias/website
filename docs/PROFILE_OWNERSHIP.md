# Profile data ownership

**Related:** #37 (A-07), `src/data/profile.ts`
**Last reviewed:** 2026-10-05

This document defines the canonical profile source, what is owner-curated versus externally
verifiable, and the update workflow. It complements [DATA_PROVENANCE.md](DATA_PROVENANCE.md).

## Canonical source

| Layer           | File                       | Role                                                                 |
| --------------- | -------------------------- | -------------------------------------------------------------------- |
| Source of truth | `src/data/profile.ts`      | Typed Zod schema + owner-curated facts consumed by routes/components |
| Tests           | `src/data/profile.test.ts` | Enforce the schema and checked profile-link constraints              |

`profile.ts` is the **single source of truth**. A duplicate YAML copy had no runtime consumer and
could drift while its test only checked a couple of substrings; it has been removed. Keep
editorial changes, schema, and verified links together in the typed source.

## Field classes

### Owner-curated (personal facts — require owner confirmation, never inferable)

- `title` and `roles[].label` — employment and role titles (e.g. "Solutions Architect @ NaNLABS").
- `location`, `links.email`, `pronouns`, `funFact`.
- `bio`, `summary`, `tagline`, `focusAreas` (editorial voice; non-goals of data governance).

### Externally verifiable (technical checks are legitimate evidence)

- `links.github`, `links.linkedin`, `links.discord`, `links.twitter`, org role `href`s.
- Organization **membership** (e.g. `github.com/vlang`, `github.com/nanlabs`) — verifiable, but
  membership does **not** prove a specific title. Title claims stay owner-curated.

### Role-claim source policy

| Claim                  | Public evidence                             | Sufficiency                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NaNLABS employment     | Self-authored profile + org existence (200) | Org link verified; **title needs owner confirmation**                                                                                                                                                                                                                                                                                  |
| V Language role        | `vlang` org membership is public            | Membership verified; exact **title has no controlled public roster**. Since ADR-004 the site uses evidence-backed wording ("V Ecosystem Maintainer"; creator/lead maintainer of VSL, lead maintainer of VTL, creator of setup-v, 34 merged `vlang/v` PRs as of 2026-09-30). The owner may restore a title once a public source exists. |
| GitHub Sponsors        | `github.com/sponsors/ulises-jeremias` (200) | Verified 2026-09-30; stored once as `links.sponsors`                                                                                                                                                                                                                                                                                   |
| AUR maintainer         | `aur.archlinux.org/account/ulises-jeremias` | Page is auth-gated (401 to automated requests); owner verifies in a browser                                                                                                                                                                                                                                                            |
| Open Source Enthusiast | Self-description                            | No external claim                                                                                                                                                                                                                                                                                                                      |

## Social-link verification (2026-09-01)

| Link                                        | Result                                                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `github.com/ulises-jeremias`                | ✅ 200                                                                                                                                     |
| `linkedin.com/in/ulisesjcf`                 | ✅ 200 (browser UA; providers may block bots)                                                                                              |
| `discord.gg/bR5VyATgka`                     | ✅ 200                                                                                                                                     |
| `twitter.com/ulisesjcf`                     | ✅ 200 (redirects to X)                                                                                                                    |
| `github.com/nanlabs`, `github.com/vlang`    | ✅ 200                                                                                                                                     |
| `aur.archlinux.org/account/ulises-jeremias` | ⚠️ 401 to automated requests — replaced 2026-09-30 by the public package search `aur.archlinux.org/packages?SeB=m&K=ulises-jeremias` (200) |
| `ulisescf.24@gmail.com`                     | Not machine-testable — owner confirms deliverability                                                                                       |

Never add a link that has not been checked. Only verified links are allowed (#37 content
requirement).

## Update workflow

1. Edit `src/data/profile.ts`; the Zod schema validates the complete profile object.
2. Run `pnpm test` — `profile.test.ts` must pass; the build fails on schema violations.
3. Open a PR. Review expectations: the owner approves personal-fact changes; reviewers check schema validity and that any new link was actually verified (paste the check result in the PR body).
4. Merge → build → production.

## Stale-link behavior

- A link that fails verification is **removed or corrected** — never softened or left in place
  with a disclaimer.
- Volatile claims (role titles, employment) are re-confirmed by the owner during periodic
  editorial reviews (quarterly cadence, mirroring DATA_PROVENANCE.md).
- No invented usernames, handles, or emails. If a field's evidence cannot be produced, the field
  is omitted rather than guessed.
