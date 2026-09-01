# Data provenance and evidence policy

**Related:** #393 (portfolio taxonomy), #399 (contextual proof), Open Source evidence pipeline
**Last reviewed:** 2026-09-01

This document defines how the website sources, refreshes, and displays evidence. It distinguishes the two evidence layers and states the staleness, last-known-good, and failure behavior for each.

## Evidence layers

| Layer                   | Source                                                                         | Refresh mechanism                                                                                                               | Consumers                                                                   |
| ----------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Open Source evidence    | `src/data/generated/github-evidence.json` (committed cache)                    | `pnpm data:refresh` → `scripts/refresh-github-data.mjs`                                                                         | `/open-source` ledger + constellation                                       |
| Agent Toolkit inventory | `src/features/agent-toolkit/data/inventory.snapshot.json`                      | `scripts/sync-agent-toolkit-inventory.py`                                                                                       | `/agent-toolkit` nexus, provenance strip                                    |
| Create Awesome catalogs | `src/features/create-awesome/data/generated/compatibility.json`                | `pnpm data:create-awesome:refresh` + scheduled drift workflow                                                                   | `/create-awesome` composer/variants                                         |
| Portfolio proof lines   | `src/data/portfolio.ts` `proofLines` (editorial + repository-metadata sources) | Manual editorial review; volatile lines carry `verifiedAt` and are re-verified against the linked repository before any refresh | Flagship provenance blocks, ProofStrip, Work tiers, homepage featured areas |

## Portfolio proof policy (#399)

`proofLines` are contextual, not a leaderboard:

- **Allowlisted kinds**: `maintenance`, `distribution`, `release`, `demo`, `role`, `ecosystem-scale`, `history`, `channel-freshness`.
- **Volatile kinds** (`release`, `maintenance`, `channel-freshness`) **must** carry `verifiedAt` — enforced at schema level; the build fails otherwise.
- **`ecosystem-scale`** requires an external repository owner (never personal scale).
- **Stars/forks/downloads never appear** as values or ranking. Tests forbid popularity patterns in proof text.
- **Provenance traceability**: every portfolio entry carries `evidence.sourceUrl` (the linked repository or snapshot) and `sourceType`. A proof line answers: _where did this come from?_ → the entry's `evidence`; _when was it checked?_ → the line's `verifiedAt`; _is it stale?_ → reviewers re-verify against `evidence.sourceUrl` before refreshing the line's `verifiedAt`; _what if refresh fails?_ → the committed line remains (editorial last-known-good; the site never breaks on remote failure because portfolio proof is committed data, not a runtime fetch).

### Refresh workflow

1. Open the entry's `evidence.sourceUrl` (or its releases page for `release` lines).
2. Confirm the claim still holds (channel versions, maintenance activity, release existence).
3. Update the `verifiedAt` to the review date and commit through a reviewed PR.
4. If a claim no longer holds, **delete the line** — never soften wording or invent substitutes.

### No browser-time provider calls

Client code must not call GitHub, npm, PyPI, AUR, Homebrew, or Docker APIs. All volatile values come from committed generated snapshots or dated editorial proof lines. Tests assert this.

## Open Source pipeline behavior

`scripts/refresh-github-data.mjs`:

- Exit **1** only when the committed cache is missing, corrupt, or schema-invalid (critical).
- Without a token: keeps cache, `mode: 'offline-cache'`, volatile metrics omitted.
- API failure per repo: `apiFailed` note, cache kept, **exit 0** — last-known-good always wins.
- Stars are fetched but intentionally never written (no vanity metrics without a promotion decision).

## Staleness thresholds

- Open Source `generatedAt`: reviewers should refresh before content releases; there is no automated staleness alarm by design (refresh is a review-gated editorial action).
- Toolkit inventory exposes its own `verifiedAt` on the page.
- Portfolio volatile proof: any line older than a quarterly review cycle should be re-verified or removed in the next editorial pass.
