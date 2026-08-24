# Post-Launch Feedback Process

**Owner:** Ulises Jeremias

**Start:** when the production launch is accepted
**Status:** Ready for owner review

## Purpose

Collect evidence from real visitors without adding hidden analytics, invented
metrics, or a second support system. Discord is for conversation. GitHub
issues, pull requests, and repository documentation are the durable trail.

## Intake Channels

| Channel             | Use                                                                                           | Record                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| GitHub issue        | Bugs, broken links, incorrect facts, accessibility, performance, and reproducible UX friction | Repository, route, revision, browser, steps, expected result, actual result, evidence             |
| GitHub pull request | Proposed fixes, content edits, accessibility changes, and documentation improvements          | Link to the issue, changed source, validation, and screenshots when relevant                      |
| Discord             | Quick questions, first reactions, coordination, and finding the right repository              | Convert actionable reports into a GitHub issue; do not use Discord as the sole decision record    |
| Email               | Private or sensitive reports, including licensing and personal-data concerns                  | Acknowledge privately, redact sensitive details, and create a minimal public issue only when safe |

No private analytics, session recordings, member counts, or visitor identity
data are added as part of this process.

## Report Template

Use the following fields for a GitHub issue or an internal triage note:

```text
Route or repository:
Production URL:
Observed revision, if known:
Browser and device:
Assistive technology, if relevant:
What happened:
Expected result:
Steps to reproduce:
Evidence or screenshot:
Privacy or licensing concern:
Suggested severity: P0 / P1 / P2 / P3
```

Do not include secrets, private Discord messages, personal contact details, or
raw user data in public issues.

## Severity

| Level | Definition                                                                                                 | Response                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| P0    | Outage, security issue, licensing exposure, broken canonical route, or materially false public claim       | Acknowledge immediately, stop unrelated release work, mitigate or revert, and document the incident |
| P1    | Broken primary action, severe accessibility regression, incorrect install path, or major route failure     | Acknowledge within one business day, reproduce, assign an owner, and schedule the smallest safe fix |
| P2    | Moderate UX friction, content clarity issue, performance regression below the launch bar, or visual defect | Triage in the next weekly review and link to evidence or a follow-up PR                             |
| P3    | Enhancement, new route idea, optional integration, or future visual exploration                            | Preserve as a scoped issue; do not expand v1.1 without evidence                                     |

## Cadence

- First 24 hours: check production smoke, new public reports, broken destinations, and legal or security concerns.
- First 72 hours: reproduce P0/P1 reports, identify regressions by revision, and publish a status note when user impact exists.
- Day 7: review grouped P2/P3 feedback, duplicate reports, and the most common route or device patterns.
- Day 14: publish a short owner review covering resolved issues, accepted follow-ups, rejected scope, and v1.1 candidates.
- Weekly thereafter: repeat the evidence review while the site remains actively iterated.

## Triage Rules

- Reproduce against the public URL first, then against the reported revision when available.
- Record the route, viewport, browser, assistive technology, and exact expected/actual behavior.
- Check whether the report is a source-fact issue, route delivery issue, accessibility issue, content issue, or future enhancement.
- Prefer a protected pull request with a focused test or source update over an ad hoc production edit.
- Close only after the fix is deployed, the original reproduction is checked, and the issue links to the validating evidence.
- Keep a report open when it depends on owner judgment, missing human evidence, or an unresolved product decision.

## Success Criteria

- No unacknowledged P0 report remains open.
- Every P1 report has an owner, reproduction status, and next action.
- The weekly review identifies the top three recurring friction patterns without inventing visitor counts.
- Human screen-reader, zoom, contrast, and visual findings are recorded separately from automated CI results.
- Decisions that affect architecture or route ownership are linked to an ADR or a GitHub issue.

## Privacy and Moderation

The Community page remains the source for the workshop scope, privacy language,
and distinction between Discord and GitHub. Do not scrape Discord or publish
private conversations. Ask before attributing feedback to a person. Remove
personal data from screenshots and logs before attaching them to an issue.

## References

- `docs/launch/2026-08-24-launch-checklist.md`
- `src/features/community/data/index.ts`
- `docs/design/current/uiux-manual-qa-checklist.md`
- Issue [#310](https://github.com/ulises-jeremias/website/issues/310)
