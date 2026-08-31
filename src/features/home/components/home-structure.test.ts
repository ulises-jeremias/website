import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const componentsDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolve(componentsDirectory, '../../..');

async function readSource(path: string): Promise<string> {
  try {
    return await readFile(resolve(sourceDirectory, path), 'utf8');
  } catch {
    return '';
  }
}

describe('Synthwave Systems Atlas homepage', () => {
  it('uses the immersive hero, atlas, and three evidence structures', async () => {
    const homepage = await readSource('pages/index.astro');

    // The atlas is composed inside NestExplore (secondary exploration, #403).
    expect(homepage).toContain("import NestExplore from '../features/home/components/NestExplore.astro'");
    expect(homepage).toContain("import NestStatus from '../features/home/components/NestStatus.astro'");
    expect(homepage).toContain("import AboutPanel from '../features/home/components/AboutPanel.astro'");
    expect(homepage).toContain(
      "import FeaturedProjectLedger from '../features/home/components/FeaturedProjectLedger.astro'",
    );
    // The hero no longer hosts the atlas — identity-first (#395).
    expect(homepage).not.toContain('slot="atlas"');
    expect(homepage).not.toMatch(/ProfileSection|CurrentlyBuilding|FeaturedWorlds|Strengths|OpenSourceProof|Contact/);
  });

  it('presents exactly four flagship areas as the first project-oriented section (#402)', async () => {
    const homepage = await readSource('pages/index.astro');
    const data = await readSource('features/home/data/index.ts');

    // FeaturedAreas renders immediately after the hero, before evidence panels
    // and before the Digital Nest exploration (#403).
    const heroIndex = homepage.indexOf('<Hero />');
    const featuredIndex = homepage.indexOf('<FeaturedAreas />');
    const evidenceIndex = homepage.indexOf('home-evidence');
    const nestIndex = homepage.indexOf('<NestExplore />');
    expect(featuredIndex).toBeGreaterThan(heroIndex);
    expect(featuredIndex).toBeLessThan(evidenceIndex);
    expect(nestIndex).toBeGreaterThan(evidenceIndex);

    // Exactly four areas, in canonical order.
    const areaIds = [...data.matchAll(/^\s{4}id: '([a-z-]+)',$/gm)].map((m) => m[1]);
    expect(areaIds).toEqual(['agentic', 'horneroconfig', 'v-ecosystem', 'create-awesome']);
    // Agentic entry carries the three stack members, not separate flagships.
    expect(data).toContain('Agent Toolkit · Agentic Workstation · Agentic Harness');
    // No stars/downloads popularity ranking.
    expect(data).not.toMatch(/\d+\s+stars/i);
  });

  it('repositions Digital Nest as labeled secondary exploration with textual routes (#403)', async () => {
    const nest = await readSource('features/home/components/NestExplore.astro');
    const homepage = await readSource('pages/index.astro');

    // Labeled as an alternate visual map — not the primary taxonomy.
    expect(nest).toContain('Explore the Digital Nest');
    expect(nest).toContain('alternate visual map');
    // Compact textual route list links every world.
    expect(nest).toContain('nest-explore__routes');
    expect(nest).toContain('atlasWorlds.map');
    // The atlas remains embedded (visual identity preserved).
    expect(nest).toContain('<ProjectAtlas />');
    // NestExplore appears after evidence panels in the homepage DOM.
    const evidenceIndex = homepage.indexOf('home-evidence');
    const nestIndex = homepage.indexOf('<NestExplore />');
    expect(nestIndex).toBeGreaterThan(evidenceIndex);
  });

  it('renders verified profile identity as accessible HTML text', async () => {
    const hero = await readSource('features/home/components/Hero.astro');

    expect(hero).toContain("from '@/data/profile");
    expect(hero).toContain('heroKeywords');
    expect(hero).toContain('terminalQuote');
    expect(hero).toContain('<SynthwaveEnvironment');
    expect(hero).toMatch(/hero__name/);
    expect(hero).not.toMatch(/avatar\.png|placeholder-user/i);
  });

  it('leads with developer-tooling positioning before Digital Nest exploration (#395)', async () => {
    const hero = await readSource('features/home/components/Hero.astro');

    // Positioning statement: concrete developer-tooling identity, not internal catalog.
    expect(hero).toContain('I build developer tooling');
    // Primary CTA leads to Work (/projects); secondary to GitHub.
    expect(hero).toContain('href="/projects"');
    expect(hero).toContain('Explore my work');
    expect(hero).toContain('View on GitHub');
    // CTA no longer anchors into the atlas — the atlas is secondary exploration.
    expect(hero).not.toContain('href="#project-atlas"');
    // No inventory counts or fake metrics in the hero.
    expect(hero).not.toMatch(/\d+\s+(skills|agents|loops|stars|downloads)/i);
  });

  it('builds the atmosphere from the ZIP hero plate plus CSS/SVG layers', async () => {
    const environment = await readSource('features/home/components/SynthwaveEnvironment.astro');

    expect(environment).toContain('hero-bg.webp');
    expect(environment).toContain('synthwave-environment__veil');
    expect(environment).toContain('synthwave-environment__scanlines');
    expect(environment).toContain('synthwave-environment__floor-fade');
    expect(environment).toContain('aria-hidden="true"');
  });

  it('renders all canonical worlds as ZIP-style island cards with constellation overlay', async () => {
    const atlas = await readSource('features/home/components/ProjectAtlas.astro');
    const world = await readSource('features/home/components/ProjectWorld.astro');

    expect(atlas).toContain('atlasWorlds');
    expect(atlas).toContain('<AtlasConnections');
    expect(atlas).toContain('<ProjectWorld');
    expect(atlas).toContain('project-atlas__chevron');
    expect(atlas).not.toContain('<WorldIllustration');
    expect(world).toContain('data-world-id');
    expect(world).toContain('href={world.path}');
    expect(world).toContain('data-related-worlds');
    expect(world).toContain('/assets/nest/');
    expect(world).toContain('art-fade');
    expect(world).toContain('atlas-world__island');
  });

  it('includes the factual responsibility topology with a structured fallback', async () => {
    const home = await readSource('pages/index.astro');
    const topology = await readSource('shared/components/ResponsibilityTopology.astro');

    // The Personal DX topology is out of the top-level flagship classification (#402);
    // responsibility boundaries live textually in /agentic. The component remains
    // available for Personal DX stories.
    expect(home).not.toContain('ResponsibilityTopology');
    expect(topology).toContain('aria-hidden="true"');
    expect(topology).toContain('class="dx-topology__structured"');
    expect(topology).toContain('Edges describe responsibility, not required installation');
  });

  it('keeps original SVG illustration vocabulary available for non-atlas uses', async () => {
    const illustrations = await readSource('features/home/components/WorldIllustration.astro');
    const expected = [
      'desktop',
      'workstation',
      'capability-core',
      'computation-lab',
      'scaffold',
      'contributor-network',
      'field-notes',
      'project-ledger',
      'source-branch',
    ];

    for (const illustration of expected) expect(illustrations).toContain(`'${illustration}'`);
  });

  it('uses canonical evidence data without generated metrics or portraits', async () => {
    const evidence = (
      await Promise.all([
        readSource('features/home/components/NestStatus.astro'),
        readSource('features/home/components/AboutPanel.astro'),
        readSource('features/home/components/FeaturedProjectLedger.astro'),
      ])
    ).join('\n');

    expect(evidence).toContain('nestStatus');
    expect(evidence).not.toContain('nest-status__spark');
    expect(evidence).toContain("from '@/data/profile");
    expect(evidence).toContain('featuredProjectLedger');
    expect(evidence).not.toMatch(/commits|stars|downloads|coffee|generated portrait/i);
    expect(evidence).not.toMatch(/avatar\.png|placeholder-user/i);
  });

  it('applies chrome-text and recomposes the atlas for mobile and reduced motion', async () => {
    const [styles, effects, hero] = await Promise.all([
      readSource('styles/home.css'),
      readSource('styles/effects.css'),
      readSource('features/home/components/Hero.astro'),
    ]);

    expect(hero).toContain('chrome-text');
    expect(effects).toContain('.chrome-text');
    expect(styles).toMatch(/@media\s*\(width\s*<\s*768px\)/);
    expect(styles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(styles).toContain('.project-atlas__worlds');
    expect(styles).toContain('.atlas-world:focus-visible');
    expect(styles).toContain('atlas-world--drop');
    expect(styles).toContain('object-position: center 38%');
  });
});
