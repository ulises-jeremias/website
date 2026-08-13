# Create Awesome catalog snapshot

The canonical `cna-templates`, `cpa-templates`, and `cva-templates` repositories
own catalog inventory and declared metadata. Their corresponding CLI repositories
are pinned semantic references for how that metadata is interpreted.

The website consumes a committed normalized snapshot. Normal builds and tests do
not fetch GitHub.

## Commands

```sh
# Explicit networked refresh from current canonical main branches
pnpm data:create-awesome:refresh

# Read-only, offline validation and deterministic regeneration from pinned files
pnpm data:create-awesome:check

# Networked freshness signal; does not modify the snapshot
pnpm data:create-awesome:drift
```

The refresh resolves exact commits, fetches immutable registry/schema/semantic
files, validates every family, builds all normalized output in memory, and only
then replaces the committed pinned cache and snapshot. If any family fails, the
previous committed snapshot remains untouched.

`pinned/source-lock.json`, every file below `pinned/`, and
`src/features/create-awesome/data/generated/compatibility.json` are generated.
Do not edit them manually.

`src/features/create-awesome/data/generated/compatibility.schema.json` is the
hand-maintained snapshot contract. Both `refresh` and `check` require it and
fail if it is absent. Change it deliberately when the normalized shape changes.

Scheduled drift is a maintenance signal, not a normal pull-request gate. A
repository HEAD change with unchanged catalog/schema/semantic blobs is reported
as `head-only` and does not fail the drift run.
