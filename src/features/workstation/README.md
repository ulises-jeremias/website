# Workstation Feature

Domain: **Agentic Workstation — Personal DX graph** (`HorneroConfig` optional · `Workstation` provisioning · `Toolkit` capabilities · `Agentic Harness` persistent context).

**Identity:** midnight `#020617` / cyan `#22D3EE` / violet `#A78BFA` / lime `#84CC16`.

## Structure

```text
workstation/
├── components/
│   ├── EcosystemDiagram.astro   # Personal DX graph SVG
│   ├── StackDiagram.astro       # Graph nodes (not a forced ladder)
│   ├── WorkstationAtlas.astro   # Stations: terminal, profiles, uplink, harness
│   ├── WorkstationHero.astro
│   ├── LayerCard.astro
│   ├── LayersSection.astro
│   ├── ProvisioningSection.astro
│   ├── DoctorChecks.astro
│   ├── ToolkitRationale.astro
│   └── ThinWorkstationBadge.astro
├── data/
│   └── index.ts                 # Layers, canonical profiles, provisioning, doctor, rationale
├── services/
│   └── workstation.ts
├── types/
│   └── index.ts
└── index.ts
```

## Principles

- **Thin workstation:** `agentic-workstation` ships no `skills/*`, `loops/*`, `mcp/*`, `prompts/*`, `agents/*`, `packs/teams`. Capabilities via `uv tool install --force agent-toolkit-cli && agent-toolkit install`. Only `dev-companion/runner` retained.
- **Harness ≠ Toolkit:** `ulises-jeremias/agentic-harness` provides persistent AI workspace context.
- **Profiles:** only from `home/.chezmoidata/profiles.yaml` (technical · non-technical · ai · node · python · data · infra · minimal · custom).
- Data in `data/index.ts`; import via `@/features/workstation`.

## Page

Router: `src/pages/agentic-workstation/index.astro`.
