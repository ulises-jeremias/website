import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { portfolioAreas } from './portfolio';
import { profile } from './profile';
import {
  getPartnershipMailto,
  getSponsorLinkRel,
  GITHUB_SPONSORS_URL,
  sponsorMetrics,
  sponsorMetricSchema,
  sponsors,
  sponsorSchema,
  sponsorshipAreas,
  sponsorshipModes,
  sponsorshipPrinciples,
  validateSponsorship,
} from './sponsorship';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('sponsorship model (ADR-004)', () => {
  it('uses the canonical GitHub Sponsors URL from the profile', () => {
    expect(GITHUB_SPONSORS_URL).toBe('https://github.com/sponsors/ulises-jeremias');
    expect(GITHUB_SPONSORS_URL).toBe(profile.links.sponsors);
  });

  it('routes partnership conversations to the canonical profile email', () => {
    expect(getPartnershipMailto()).toMatch(
      new RegExp(`^mailto:${profile.contact.email.replace('.', '\\.')}\\?subject=`),
    );
  });

  it('maps exactly one sponsorship area to each portfolio area', () => {
    expect(validateSponsorship()).toEqual([]);
    expect(sponsorshipAreas.map((area) => area.id).sort()).toEqual(portfolioAreas.map((area) => area.id).sort());
  });

  it('describes partner fit as categories, never company names', () => {
    for (const area of sponsorshipAreas) {
      for (const fit of area.partnerFit) {
        // Category phrases are lower-case after the first word or plural nouns — no brand names.
        expect(fit).not.toMatch(/\b(Inc|LLC|Ltd|GmbH|\.com|\.io)\b/);
      }
    }
  });

  it('scopes V support to maintenance time, not ownership of V', () => {
    const v = sponsorshipAreas.find((area) => area.id === 'v-ecosystem')!;
    expect(v.scope?.toLowerCase()).toContain('vlang organization');
    expect(v.scope?.toLowerCase()).toContain('does not buy');
  });

  it('keeps Hornero OS scoped as a preview, not a shipped distribution', () => {
    const hornero = sponsorshipAreas.find((area) => area.id === 'hornero')!;
    expect(hornero.scope?.toLowerCase()).toContain('development preview');
    expect(hornero.scope?.toLowerCase()).toContain('no installer');
  });

  it('offers GitHub Sponsors for individuals and conversations for partnerships — no price tiers', () => {
    expect(sponsorshipModes.filter((mode) => mode.path === 'github-sponsors').map((mode) => mode.id)).toEqual([
      'supporter',
    ]);
    const serialized = JSON.stringify({ sponsorshipAreas, sponsorshipModes });
    expect(serialized).not.toMatch(/\$\s?\d|USD|\b(gold|silver|bronze|platinum)\b/i);
  });

  it('publishes the independence and disclosure principles', () => {
    const ids = sponsorshipPrinciples.map((principle) => principle.id);
    expect(ids).toEqual(
      expect.arrayContaining(['no-endorsement', 'disclosure', 'no-hidden-influence', 'exclusivity', 'trust-first']),
    );
    const disclosure = sponsorshipPrinciples.find((principle) => principle.id === 'disclosure')!;
    expect(disclosure.body).toContain('rel="sponsored"');
  });

  it('contains no seeded or fake sponsors', () => {
    // Sponsors are added only for confirmed relationships (ADR-004).
    expect(sponsors).toEqual([]);
    // Companies that merely emailed about partnerships must never appear as partners.
    // cspell:disable-next-line
    expect(read('src/data/sponsorship.ts')).not.toMatch(/Fluxion|Agensi|Future AGI|BizBot/i);
  });

  it('marks compensated sponsor links as sponsored', () => {
    expect(getSponsorLinkRel({ compensated: true })).toBe('sponsored noopener noreferrer');
    expect(getSponsorLinkRel({ compensated: false })).toBe('noopener noreferrer');
  });

  it('rejects sponsor entries without disclosure, or logos without alt text', () => {
    const base = {
      name: 'Example',
      url: 'https://example.com',
      relationship: 'project-sponsor',
      areas: ['agentic'],
      startDate: '2026-10',
      disclosure: 'Paid support for Agent Toolkit maintenance.',
      compensated: true,
      active: true,
    };
    expect(sponsorSchema.safeParse(base).success).toBe(true);
    expect(sponsorSchema.safeParse({ ...base, disclosure: '' }).success).toBe(false);
    expect(sponsorSchema.safeParse({ ...base, logo: '/assets/sponsors/example.svg' }).success).toBe(false);
    expect(sponsorSchema.safeParse({ ...base, endDate: '2026-12' }).success).toBe(false);
    expect(sponsorSchema.safeParse({ ...base, url: 'http://example.com' }).success).toBe(false);
    expect(sponsorSchema.safeParse({ ...base, url: 'javascript:alert(1)' }).success).toBe(false);
    expect(sponsorSchema.safeParse({ ...base, areas: ['agentic', 'agentic'] }).success).toBe(false);
    expect(sponsorSchema.safeParse({ ...base, active: false, startDate: '2026-10', endDate: '2026-09' }).success).toBe(
      false,
    );
  });

  it('renders the full disclosure for each sponsor: paid label, areas, and dates', () => {
    const page = read('src/features/sponsor/components/SponsorPage.astro');
    expect(page).toContain('sponsor.compensated && <span class="sp-roster__paid">Paid relationship</span>');
    expect(page).toContain('sponsor.areas.map(areaTitle)');
    expect(page).toContain('sponsor.endDate');
    expect(page).toContain('getPastSponsors()');
  });
});

describe('sponsor metrics snapshot', () => {
  it('parses with a timestamp and dated, sourced, caveated metrics', () => {
    expect(sponsorMetrics.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    for (const metric of sponsorMetrics.metrics) {
      expect(metric.source.url).toMatch(/^https:\/\//);
      expect(metric.period.start <= metric.period.end).toBe(true);
      expect(metric.caveat.length).toBeGreaterThan(20);
    }
  });

  it('never presents downloads or counts as people', () => {
    for (const metric of sponsorMetrics.metrics) {
      expect(metric.unit).not.toMatch(/\busers?\b|\binstalls?\b|\bpeople\b/i);
    }
    expect(
      sponsorMetricSchema.safeParse({
        id: 'x',
        project: 'X',
        label: 'x',
        value: 1,
        unit: 'monthly users',
        period: { start: '2026-01-01', end: '2026-01-31' },
        source: { name: 'x', url: 'https://example.com' },
        caveat: 'A caveat long enough to pass the schema.',
      }).success,
    ).toBe(false);
  });

  it('excludes Agent Toolkit download counts until they have a longer history', () => {
    expect(
      sponsorMetrics.metrics.filter((metric) => metric.project === 'Agent Toolkit' && /download/i.test(metric.unit)),
    ).toEqual([]);
  });
});

describe('sponsorship surfaces', () => {
  it('renders the sponsor page from data with the GitHub Sponsors CTA and principles anchor', () => {
    const page = read('src/features/sponsor/components/SponsorPage.astro');
    expect(page).toContain('GITHUB_SPONSORS_URL');
    expect(page).toContain('id="principles"');
    expect(page).toContain('getSponsorLinkRel(sponsor)');
    expect(page).not.toMatch(/https:\/\/github\.com\/sponsors\//);
  });

  it('keeps contextual support notes to one per relevant project page', () => {
    const pages = [
      'src/pages/agent-toolkit/index.astro',
      'src/pages/agentic/index.astro',
      'src/features/dotfiles/components/DotfilesWorld.astro',
      'src/features/hornero-os/components/HorneroOsPage.astro',
      'src/pages/v/index.astro',
      'src/pages/create-awesome/index.astro',
    ];
    for (const path of pages) {
      const matches = read(path).match(/<SupportNote /g) ?? [];
      expect(matches.length, path).toBe(1);
    }
  });
});
