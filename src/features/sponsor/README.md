# sponsor

The `/sponsor` route (ADR-004). A single composed component, `SponsorPage`, renders
everything from `src/data/sponsorship.ts` — areas, support modes, principles, the
dated metrics snapshot (`src/data/generated/sponsor-metrics.json`), and the sponsor
roster. Pages and components never retype commercial wording.

- Add a confirmed sponsor: append to `rawSponsors` in `src/data/sponsorship.ts` with
  `relationship`, `areas`, `startDate`, `disclosure`, and `compensated`. Compensated
  links render with `rel="sponsored"`. Never add a sponsor that is not confirmed.
- Refresh metrics: `pnpm data:sponsor:refresh` (reviewed PR), validate with
  `pnpm data:sponsor:check`.
- Contextual invitations on project pages use `src/shared/components/SupportNote.astro`.
