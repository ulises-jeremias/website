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

    expect(homepage).toContain("import ProjectAtlas from '../features/home/components/ProjectAtlas.astro'");
    expect(homepage).toContain("import NestStatus from '../features/home/components/NestStatus.astro'");
    expect(homepage).toContain("import AboutPanel from '../features/home/components/AboutPanel.astro'");
    expect(homepage).toContain(
      "import FeaturedProjectLedger from '../features/home/components/FeaturedProjectLedger.astro'",
    );
    expect(homepage).not.toMatch(/ProfileSection|CurrentlyBuilding|FeaturedWorlds|Strengths|OpenSourceProof|Contact/);
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
    const atlas = await readSource('features/home/components/ProjectAtlas.astro');
    const topology = await readSource('shared/components/ResponsibilityTopology.astro');

    expect(atlas).toContain('ResponsibilityTopology');
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
    expect(evidence).toContain('nest-status__spark');
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
