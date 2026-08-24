# agentic-harness feature

Public surface for the Agentic Harness — the persistent workspace layer of the
Personal DX stack (`ulises-jeremias/agentic-harness`).

- `data/index.ts` — page meta, workspace state sections, runtime surfaces,
  quick-start commands, cross-links, pack semantics. All copy is grounded in
  the source repo README/AGENTS.md (verified 2026-08-24).
- `components/HarnessWorkspace.astro` — static informative figure
  (workspace state → Toolkit runtime → loops/jobs/sessions) with a structured
  textual fallback per `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md`.

Shared ecosystem visuals (ownership matrix, adoption paths) live in
`src/features/personal-dx/`; the canonical data model lives in
`src/data/personal-dx-stack.ts`.
