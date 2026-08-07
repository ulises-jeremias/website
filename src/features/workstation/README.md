# Workstation Feature

Domain: **Agentic Workstation — 4-layer ecosystem** (`HorneroConfig/desktop → Workstation/machine → Toolkit/capabilities → Harness/runtime`).

**Identity:** midnight `#020617` / cyan `#22D3EE` / violet `#A78BFA` / lime `#84CC16`.

## Structure

```
workstation/
├── components/
│   ├── EcosystemDiagram.astro   # 4-layer SVG (midnight identity)
│   ├── WorkstationHero.astro    # Hero with thin-workstation badge
│   ├── LayerCard.astro          # Single layer card
│   ├── LayersSection.astro      # 4-layer narrative grid
│   ├── ProvisioningSection.astro
│   ├── DoctorChecks.astro
│   ├── ToolkitRationale.astro
│   └── ThinWorkstationBadge.astro
├── data/
│   └── index.ts                 # Single source of truth for layers/provisioning/doctor/rationale
├── services/
│   └── workstation.ts           # Pure helpers (no UI)
├── types/
│   └── index.ts                 # Domain types
└── index.ts                     # Public API
```

## Principles

- **Thin workstation verified:** `agentic-workstation` ships no `skills/*`, `loops/*`, `mcp/*`, `prompts/*`, `agents/*`, `packs/teams`. All capabilities delegated to `agent-toolkit` via `uv tool install --force agent-toolkit-cli && agent-toolkit install`. Catalog provided by toolkit at runtime. Only `dev-companion/runner` retained — see `docs/ARCHITECTURE.md` + `docs/AGENT_TOOLKIT.md`.
- Data lives in `data/index.ts`; components receive props.
- Services have no UI; components have no `astro:content` queries.
- Import only via public API: `import { LayersSection } from '@/features/workstation'`.

## Page

Thin router at `src/pages/agentic-workstation.astro` re-exports feature components.

## Design tokens

```css
--ws-midnight: #020617;
--ws-cyan: #22d3ee;
--ws-violet: #a78bfa;
--ws-lime: #84cc16;
```
