# Digital Nest Launch Checklist

**Checklist date:** 2026-08-24

**Candidate revision:** `main@6f8fc0abb5cd39062f9f616b1090657d38f3a5b2`

**Production:** <https://www.ulises-jeremias.dev/>
**Status:** Engineering launch gate complete; owner and assistive-technology gates remain open.

## Release Scope

The launch candidate contains the completed route redesign waves A-E for:

`/`, `/dotfiles/`, `/agentic-workstation/`, `/agent-toolkit/`, `/v/`,
`/create-awesome/`, `/community/`, `/blog/`, `/projects/`, `/open-source/`,
and `/404.html`.

The launch preserves the Astro static build, shared `SectionLayout` shell,
feature-based data boundaries, native controls, no-JavaScript fallbacks, and
reduced-motion behavior.

## Automated Gate

| Gate                        | Evidence                                                                                                                              | Result                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Protected branch            | Waves A-E merged through PRs #369, #370, #371, #373, and #374; catalog maintenance through #375                                       | Pass                                   |
| Build                       | GitHub run [32733604155](https://github.com/ulises-jeremias/website/actions/runs/32733604155)                                         | Pass                                   |
| Lint                        | GitHub run [32733604096](https://github.com/ulises-jeremias/website/actions/runs/32733604096)                                         | Pass                                   |
| Typecheck                   | GitHub run [32733604578](https://github.com/ulises-jeremias/website/actions/runs/32733604578)                                         | Pass                                   |
| Unit tests                  | GitHub run [32733604161](https://github.com/ulises-jeremias/website/actions/runs/32733604161)                                         | Pass                                   |
| Browser quality             | GitHub run [32733604190](https://github.com/ulises-jeremias/website/actions/runs/32733604190), 363/363 checks                         | Pass                                   |
| Production deployment smoke | GitHub run [32733626565](https://github.com/ulises-jeremias/website/actions/runs/32733626565), 21/21 checks against the public origin | Pass                                   |
| Static build scope          | 11 generated public pages, including `/404.html`                                                                                      | Pass                                   |
| Route budgets               | `node scripts/check-route-budgets.mjs`                                                                                                | Pass for all mobile and desktop routes |
| Create Awesome provenance   | Snapshot check and remote drift check after PR #375                                                                                   | Pass                                   |
| Accessibility automation    | axe, semantic, keyboard, focus, reflow, and reduced-motion suites                                                                     | Pass; not a WCAG conformance claim     |

The scheduled drift run [32712596803](https://github.com/ulises-jeremias/website/actions/runs/32712596803)
failed against the older `main@099712e4` because all three upstream Create
Awesome families had changed. PR #375 refreshed the pinned inputs and corrected
the source-backed Python compatibility expectation. The current snapshot and
remote drift checks pass.

## Human Gate

The following items are intentionally not marked complete by automation:

- [ ] Run NVDA with Firefox.
- [ ] Run VoiceOver with Safari.
- [ ] Run TalkBack with Chrome.
- [ ] Review 200% and 400% browser zoom on representative routes.
- [ ] Manually sample gradient and clipped-text contrast.
- [ ] Review desktop and mobile production captures for visual and brand sign-off.
- [ ] Confirm profile role, employment, and contact facts.
- [ ] Confirm the asset-license audit and third-party notices.
- [ ] Decide whether the empty Blog stays in primary navigation.

These are acceptance gates, not hidden failures. The current documents must not
be described as human accessibility conformance or final visual approval until
the owner checks them.

## Publish Procedure

- [x] Confirm the candidate is on protected `main`.
- [x] Confirm Vercel deployment smoke targets `https://www.ulises-jeremias.dev`.
- [x] Confirm canonical host and redirect behavior through production smoke.
- [x] Confirm robots, sitemap, RSS, manifest, favicons, fonts, and representative assets.
- [ ] Owner reviews this checklist and the two launch audits.
- [ ] Owner performs the human gate against the deployed production origin.
- [ ] Owner records acceptance in the launch issue set and parent epic #319.

## Incident and Rollback Triggers

Open a P0 response when production has an outage, a broken canonical route, a
security or licensing concern, or a materially incorrect public claim. Open a
P1 response for a broken route action, severe accessibility regression, or
incorrect install command. P2 covers content friction, moderate performance
regressions, and visual defects. P3 covers enhancements and future direction.

For a release regression, stop follow-up feature work, capture the failing URL
and revision, and revert through a protected pull request. Verify the reverted
deployment with the production smoke workflow before resuming normal work.

## Post-Launch Handoff

- Feedback intake and triage follow `2026-08-24-post-launch-feedback.md`.
- v1.1 and subdomain scope follow `docs/adr/ADR-002-v1-1-and-subdomain-boundary.md`.
- Asset provenance follows `2026-08-24-asset-license-audit.md`.
- Content source freshness follows `2026-08-24-content-fact-audit.md`.

## References

- `docs/design/current/route-redesign-plan-2026-08.md`
- `docs/design/current/uiux-manual-qa-checklist.md`
- `docs/TESTING_GUIDE.md`
- `docs/GITHUB_SETUP_GUIDE.md`
- Issue [#309](https://github.com/ulises-jeremias/website/issues/309)
