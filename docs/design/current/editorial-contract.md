# Flagship project editorial contract

**Date:** 2026-08-31
**Related:** ADR-003, issue #394, #393
**Scope:** Narrative consistency for flagship project pages

## Purpose

Flagship project pages must give visitors a fast reason to care before exposing architecture, inventory, or implementation detail. This contract defines the shared editorial order and the minimum content requirements for every flagship page.

This is an editorial consistency layer, not a visual template. Each route keeps its dominant visual composition, unique interaction model, and Synthwave Systems Atlas identity.

## The nine visitor questions

Flagship pages answer these questions in approximately this order:

| #   | Question                                               | Typical artifact                              |
| --- | ------------------------------------------------------ | --------------------------------------------- |
| 1   | What problem does this work address?                   | Opening proposition, 1–2 sentences            |
| 2   | What is it?                                            | One-paragraph definition                      |
| 3   | Why does it matter?                                    | Visitor-relevant value, not feature list      |
| 4   | What evidence shows it working?                        | Screenshot, diagram, demo, or install output  |
| 5   | How is it designed or composed?                        | Architecture diagram or technical walkthrough |
| 6   | What proof/maturity/distribution context is supported? | Channels, releases, maintenance status        |
| 7   | What is Ulises's role and who owns the repository?     | Role + provenance (from portfolio taxonomy)   |
| 8   | How does someone get started or contribute?            | Install command, docs link, contribution path |
| 9   | What related work should they inspect next?            | Cross-links to related areas/projects         |

The first viewport must not require visitors to interpret raw inventory totals, topology graphs, or catalog counts before understanding the proposition (questions 1–3).

## Route application

| Route                  | Proposition focus                                                        | Detail preserved                                                       |
| ---------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `/agent-toolkit`       | Stop rebuilding your AI workflow for every coding assistant              | Capability nexus, swarm control room, install console, inventory       |
| `/agentic-workstation` | Turn a clean machine into a reproducible AI-native workstation           | Boot sequence, profile readout, health console                         |
| `/agentic-harness`     | Your coding agent sessions are temporary; your workspace should not be   | Workspace anatomy, pack guide, ownership model _(already conformant)_  |
| `/dotfiles`            | A reproducible Linux desktop that feels yours, reproducibly              | Smart Colors pipeline, theme explorer, screenshot gallery, layer stack |
| `/v`                   | My contribution span across the V language and its ecosystem             | Six lab stations, per-project diagrams and evidence                    |
| `/create-awesome`      | Composable app scaffolding across three languages, one composition model | Composer, per-runtime catalogs, distribution matrix                    |

## Shared implementation boundary

To avoid retyping facts across pages, these fields come from the portfolio taxonomy (`src/data/portfolio.ts`) rather than page-local copy:

- Proposition and description (`proposition`, `description`)
- Repository ownership and role (`repositoryOwner`, `repositorySlug`, `responsibility`)
- Maturity/time lens (`timeLens`)
- Distribution channels (`channels`)
- Evidence reference (`evidence`)

Feature-specific technical inventories (Toolkit skills, V stations, Create Awesome catalogs, Smart Colors themes) remain in their existing feature data modules.

## Content governance

- Every public role/ownership claim must reference a source and verification date before release.
- External project scale (e.g. V repository stars) is context, never a personal metric.
- No fabricated testimonials, usage claims, or launch metrics.

## Responsive and accessibility requirements

- Mobile preserves the narrative order — a large diagram must not precede the proposition.
- Heading order, landmarks, focus visibility, link names, contrast, and reduced motion must meet the existing WCAG 2.2 AA target.
- Complex diagrams require adjacent text equivalents and complete no-JavaScript content.
- Static Astro markup, CSS, and existing SVG components only. No site-wide framework or animation library.

## Testing requirements

- Content-structure tests assert the presence of proposition, role/provenance, getting-started, and related-work sections on each flagship page.
- Route-specific browser and visual tests cover each unique composition.
- No-JavaScript and reduced-motion versions are tested for complex diagrams.
- Every public role/ownership claim is validated against a source and verification date.

## Non-goals

- Do not replace route-specific art direction with one template.
- Do not remove technical inventories, architecture diagrams, or detailed examples.
- Do not create fake testimonials, usage claims, or launch metrics.
- Do not implement individual case-study routes under `/projects/[slug]`.
