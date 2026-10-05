# agent-toolkit

Feature for `/agent-toolkit` — Synthwave Systems Atlas flagship for capability distribution.

## Inventory

Counts and examples are centralized in:

- `data/inventory.snapshot.json` — derived from `ulises-jeremias/agent-toolkit` catalogs at HEAD
- `data/inventory.ts` — typed accessors (no magic numbers in components)

Refresh from a clean current checkout:

```bash
AGENT_TOOLKIT_ROOT=/path/to/current/agent-toolkit-main python3 scripts/sync-agent-toolkit-inventory.py
```

The default sibling checkout is accepted only when it is clean and exactly matches canonical
`origin/main`. This prevents a stale or locally modified repository from replacing the committed
snapshot. The scheduled drift workflow checks out upstream `main` explicitly.

## Sections

- Hero + version provenance
- Capability anatomy (selectable families + catalog examples; CSS `:has`, no JS required)
- Distribution map (profiles from snapshot)
- DevCompanion KEEP queue ≠ Swarm
- Swarm story (pair/team/full from `modules/agent_toolkit_core/swarm_recipes.v`) + Herdr/tmux commands
- Community cross-link → `/community` Digital Nest workshop
