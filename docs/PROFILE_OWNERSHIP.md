# Profile data ownership

**Related:** #37 (A-07), `src/data/profile.ts`, `src/content/profile.yaml`
**Last reviewed:** 2026-09-01

This document defines the canonical profile source, what is owner-curated versus externally
verifiable, and the update workflow. It complements [DATA_PROVENANCE.md](DATA_PROVENANCE.md).

## Canonical source

| Layer            | File                       | Role                                                                               |
| ---------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| Source of truth  | `src/data/profile.ts`      | Typed Zod schema + owner-curated facts consumed by routes/components               |
| Editorial mirror | `src/content/profile.yaml` | Human-readable mirror for review; asserted parseable by `src/data/profile.test.ts` |
| Tests            | `src/data/profile.test.ts` | Enforce schema, verified links, and the mirror's existence                         |

`profile.ts` is the **single source of truth for the site build**. The YAML mirror exists for
reviewability only — edits must land in both files in the same PR, or the mirror becomes stale.

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

| Claim                  | Public evidence                             | Sufficiency                                                                                       |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| NaNLABS employment     | Self-authored profile + org existence (200) | Org link verified; **title needs owner confirmation**                                             |
| V Language role        | `vlang` org membership is public            | Membership verified; exact **title has no controlled public roster** — owner confirms or restates |
| AUR maintainer         | `aur.archlinux.org/account/ulises-jeremias` | Page is auth-gated (401 to automated requests); owner verifies in a browser                       |
| Open Source Enthusiast | Self-description                            | No external claim                                                                                 |

## Social-link verification (2026-09-01)

| Link                                        | Result                                                      |
| ------------------------------------------- | ----------------------------------------------------------- |
| `github.com/ulises-jeremias`                | ✅ 200                                                      |
| `linkedin.com/in/ulisesjcf`                 | ✅ 200 (browser UA; providers may block bots)               |
| `discord.gg/bR5VyATgka`                     | ✅ 200                                                      |
| `twitter.com/ulisesjcf`                     | ✅ 200 (redirects to X)                                     |
| `github.com/nanlabs`, `github.com/vlang`    | ✅ 200                                                      |
| `aur.archlinux.org/account/ulises-jeremias` | ⚠️ 401 to automated requests — owner browser check required |
| `ulisescf.24@gmail.com`                     | Not machine-testable — owner confirms deliverability        |

Never add a link that has not been checked. Only verified links are allowed (#37 content
requirement).

## Update workflow

1. Edit `src/data/profile.ts` (schema-validated) and the same fields in `src/content/profile.yaml`.
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
