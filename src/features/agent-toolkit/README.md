# agent-toolkit

Feature for `/agent-toolkit` — Synthwave Systems Atlas flagship for capability distribution.

## Inventory

Counts and examples are centralized in:

- `data/inventory.snapshot.json` — derived from `ulises-jeremias/agent-toolkit` catalogs at HEAD
- `data/inventory.ts` — typed accessors (no magic numbers in components)

Refresh from a local checkout:

```bash
python3 scripts/sync-agent-toolkit-inventory.py
# or
AGENT_TOOLKIT_ROOT=/path/to/agent-toolkit python3 scripts/sync-agent-toolkit-inventory.py
```

## Sections

- Hero + version provenance
- Capability anatomy (selectable families + catalog examples; CSS `:has`, no JS required)
- Distribution map (profiles from snapshot)
- DevCompanion KEEP queue ≠ Swarm
- Swarm story (pair/team/full from `swarm/recipes.py`) + Herdr/tmux commands
- Community cross-link → `/community` Digital Nest workshop
