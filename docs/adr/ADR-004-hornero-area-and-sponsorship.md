# ADR-004 — Hornero area, sponsorship route, and sponsor evidence policy

- **Status**: Accepted
- **Date**: 2026-09-30
- **Deciders**: Ulises Jeremias
- **Scope**: Portfolio taxonomy, navigation, footer directory, sponsorship, sponsor-facing metrics, role wording
- **Amends**: [ADR-003](./ADR-003-portfolio-first-ia.md) (flagship area 2, header order, footer navigation)
- **Preserves**: ADR-001 canonical paths, ADR-002 subdomain boundary, ADR-003's four-area limit

## Context

Three things changed after ADR-003:

1. **Hornero OS became public.** The `HorneroOS` organization (8 repositories, created 2026-07-28) ships
   development-preview compositions (`v0.2.0-preview12`, 2026-09-30). Its shell, desktop defaults, and
   `horneroctl` CLI were extracted from `ulises-jeremias/dotfiles`, and HorneroConfig now depends on them
   (dotfiles #294–#305, #317). The installer and ISO are named future slots: nothing is installable.
   The site still listed Hornero OS as "incubating, no public repository yet".
2. **The site needed a credible destination for sponsors and partners** — one URL that explains the
   work, what support pays for, how to engage, and the rules that protect users' trust.
3. **Role wording needed re-scoping.** No public roster confirms the "Core Team Member" title for V
   (vlang team membership is private; the only public source was the owner's own profile README).
   Public evidence supports stronger, specific roles: creator and lead maintainer of VSL, lead
   maintainer of VTL, creator and code owner of setup-v, and 34 merged pull requests to `vlang/v`.

## Decision

### 1. Area 2 becomes "Hornero Linux Desktop" (still four areas)

`horneroconfig` is replaced by the `hornero` area with two flagship components:

| Entry         | Route         | Maturity      | Role                                       |
| ------------- | ------------- | ------------- | ------------------------------------------ |
| HorneroConfig | `/dotfiles`   | `established` | Creator and maintainer (`ulises-jeremias`) |
| Hornero OS    | `/hornero-os` | `preview`     | Creator and maintainer (`HorneroOS` org)   |

We do **not** add a fifth area: Hornero OS and HorneroConfig share lineage, runtime, and identity, and
two areas would duplicate one story. We do **not** nest Hornero OS under HorneroConfig either — that
would invert the real dependency direction.

A new `maturity` field (`established | active | early | preview`) states how far a user can rely on each
entry. `validatePortfolio()` rejects preview entries that are homepage-eligible or that claim
installability. `/hornero-os` is a new canonical, indexable route; `/dotfiles` stays canonical.

### 2. Navigation and footer

- Header order returns to ADR-003's stated order — **Work · Open Source · About** — plus **Sponsor**
  as the single header CTA (`headerVariant: 'cta'`). Four items fit the compact mobile row at 320 px.
- The footer's flat numbered "Atlas index" becomes a directory grouped by visitor intent:
  **Projects** (flagship routes), **Digital Nest** (site routes), **Support the work** (`/sponsor`,
  GitHub Sponsors, and a link to the principles). Every route with `navOrder` must declare a
  `footerGroup`; the sitemap and 404 index derive from the same registry.
- `/agentic` and `/hornero-os` now mark **Work** as active in the header.

### 3. `/sponsor` and the sponsorship model

`src/data/sponsorship.ts` is the single source of truth: areas (mapped to portfolio areas), modes,
principles, support uses, confirmed sponsors, and the metrics snapshot. Rules encoded in the schema
and tests:

- **No fabricated sponsors, logos, or testimonials.** The sponsor list starts empty; the page shows
  an honest empty state.
- **No public price tiers.** Individual support uses GitHub Sponsors
  (`https://github.com/sponsors/ulises-jeremias`, stored once as `profile.links.sponsors`).
  Partnerships start with an email.
- **Disclosure.** Every sponsor needs a relationship type, supported areas, a start date, and
  disclosure text; compensated links render `rel="sponsored noopener noreferrer"`.
- **Independence.** Sponsorship never buys a recommendation; integrations ship only after normal
  review; exclusivity only when explicitly negotiated and disclosed.
- **Scope.** V ecosystem support funds the owner's maintenance time and never implies ownership of V.
  Hornero support funds building a preview, not a shipped distribution.
- **Placement.** One quiet `SupportNote` per relevant project page, one homepage band, one CTA on
  Work and About. No sponsor banners in content sections.

### 4. Sponsor-facing metrics are a separate, stricter evidence layer

`DATA_PROVENANCE.md` forbids downloads in portfolio proof lines, and that rule stays. Sponsors
reasonably ask for adoption signals, so `/sponsor` may show a **small, dated snapshot**
(`src/data/generated/sponsor-metrics.json`, refreshed by `pnpm data:sponsor:refresh`) under these rules:

- Each metric has value, unit, exact period, source URL, and a caveat. Units may not imply people
  ("users", "installs"); the schema rejects them.
- Only metrics that survive a credibility review are collected. As of 2026-09-30:
  `create-awesome-node-app` npm downloads (12 months), `create-awesome-python-app` PyPI downloads
  (30 days, mirrors excluded), and contributor counts. **Agent Toolkit downloads are excluded** — the
  packages are weeks old and most downloads fall on release days or come from the project's own CI.
- Builds never call npm, PyPI, or GitHub. Failed sources keep their last-known-good value.

### 5. Role wording follows public evidence

Profile and portfolio roles use verifiable wording ("V Ecosystem Maintainer"; "Creator and lead
maintainer" of VSL; "Organization member and compiler contributor" for `vlang/v`). Tests reject
"Core Team" wording. Titles remain owner-curated per `docs/PROFILE_OWNERSHIP.md`: the owner may
restore a title if a public source for it is added.

## Consequences

- **Positive:** Hornero OS is represented truthfully; sponsors get one clear page; the footer reads
  as a directory instead of a numbered list; role claims survive scrutiny.
- **Negative:** the header grows to four items plus the GitHub icon; `/dotfiles` screenshots are now
  honestly labelled as the earlier X11 generation until new captures exist.
- **Follow-ups:** capture current Hyprland/Quickshell screenshots; revisit Agent Toolkit download
  metrics after roughly a quarter of history; add sponsors only when confirmed.

## Validation

- [x] Still exactly four flagship areas (`portfolio.test.ts`).
- [x] Hornero OS entry is `preview`, not homepage-eligible, and says "not installable".
- [x] Header is Work · Open Source · About · Sponsor, with one CTA (`routes.test.ts`).
- [x] Footer groups list every indexable route exactly once.
- [x] Sponsor schema rejects people-implying units, logos without alt text, and seeded sponsors.
- [x] No "Core Team" wording in profile or portfolio data.

## History

| Date       | Change              |
| ---------- | ------------------- |
| 2026-09-30 | Initial acceptance. |
