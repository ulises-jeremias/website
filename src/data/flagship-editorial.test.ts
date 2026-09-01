import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPortfolioEntryById } from '@/data/portfolio';

/**
 * Semantic editorial-contract tests (#394).
 *
 * These read the actual flagship component/route sources and assert DOM
 * narrative order and data flow — NOT the contract Markdown document.
 */
const root = process.cwd();

function readSource(path: string): string {
  return readFileSync(resolve(root, path), 'utf8');
}

interface RouteSpec {
  route: string;
  source: string;
  /** Portfolio entry the provenance block must consume. */
  entryId: string;
}

const routes: RouteSpec[] = [
  {
    route: '/agent-toolkit',
    source: 'src/features/agent-toolkit/components/CapabilityNexus.astro',
    entryId: 'agent-toolkit',
  },
  {
    route: '/agentic-workstation',
    source: 'src/features/workstation/components/WorkstationSystemMap.astro',
    entryId: 'agentic-workstation',
  },
  { route: '/agentic-harness', source: 'src/pages/agentic-harness/index.astro', entryId: 'agentic-harness' },
  { route: '/dotfiles', source: 'src/features/dotfiles/components/DotfilesWorld.astro', entryId: 'horneroconfig' },
  { route: '/v', source: 'src/features/v/components/VComputationalLab.astro', entryId: 'v' },
  {
    route: '/create-awesome',
    source: 'src/features/create-awesome/components/CreateAwesomeWorld.astro',
    entryId: 'create-node-app',
  },
];

describe('flagship editorial contract — route implementation (#394)', () => {
  it('every flagship route consumes the portfolio taxonomy for role/ownership', () => {
    for (const { route, source } of routes) {
      const code = readSource(source);
      expect(code, `${route} must import FlagshipProvenance`).toContain('FlagshipProvenance');
      expect(code, `${route} must pass an entryId (portfolio data flow)`).toMatch(/entryId="([a-z-]+)"/);
    }
  });

  it('every flagship route states the problem before inventory content', () => {
    for (const { route, source } of routes) {
      const code = readSource(source);
      // Problem/proposition marker: the shared problem class or Harness's
      // problem-first hero lead.
      const problemIndex = Math.min(
        ...[code.indexOf('__problem'), code.indexOf('ah-hero__lead'), code.indexOf('v-lab__lede')].filter(
          (i) => i >= 0,
        ),
      );
      // Inventory signals: count-bearing elements.
      const inventoryIndex = Math.min(
        ...[
          code.indexOf('fact-line'),
          code.indexOf('atk-nexus__stage'),
          code.indexOf('ws-map__stage'),
          code.indexOf('ca-world__scene'),
          code.indexOf('ca-world__hero-ledger'),
        ].filter((i) => i >= 0),
      );
      expect(problemIndex, `${route} problem/proposition present`).toBeGreaterThanOrEqual(0);
      if (Number.isFinite(inventoryIndex)) {
        expect(problemIndex, `${route} problem must precede inventory in DOM source order`).toBeLessThan(
          inventoryIndex,
        );
      }
    }
  });

  it('role and ownership come from the portfolio entry — never retyped', () => {
    for (const { entryId } of routes) {
      const entry = getPortfolioEntryById(entryId)!;
      // The provenance component derives display text from these fields.
      expect(entry.roleLabel ?? entry.responsibility).toBeTruthy();
      expect(entry.repositoryOwner).toBeTruthy();
      expect(entry.repositorySlug).toBeTruthy();
    }
    // The shared component itself must not hardcode role strings.
    const provenance = readSource('src/shared/components/FlagshipProvenance.astro');
    expect(provenance).toContain('entry.roleLabel ?? entry.responsibility');
    expect(provenance).toContain('entry.repositoryOwner');
    expect(provenance).not.toMatch(/role: '|roleLabel: '/);
  });

  it('external organization ownership stays explicit on the V route', () => {
    const v = getPortfolioEntryById('v')!;
    expect(v.repositoryOwner).toBe('vlang');
    expect(v.responsibility).toBe('org-member-work');
    expect(v.roleLabel).toBe('Core Team Member');
    // V page provenance note explicitly distinguishes ownership.
    const lab = readSource('src/features/v/components/VComputationalLab.astro');
    expect(lab).toContain('maintained by Ulises, not owned');
    expect(lab).toContain('scale belongs to the ecosystem');
  });

  it('proof lines render through ProofStrip with verified dates where volatile', () => {
    const provenance = readSource('src/shared/components/FlagshipProvenance.astro');
    expect(provenance).toContain('<ProofStrip');
    for (const { entryId } of routes) {
      const entry = getPortfolioEntryById(entryId)!;
      // Volatile proof kinds used by these entries carry verification dates.
      for (const line of entry.proofLines) {
        if (['release', 'maintenance', 'channel-freshness'].includes(line.kind)) {
          expect(line.verifiedAt, `${entryId} volatile proof "${line.kind}" is dated`).toBeDefined();
        }
      }
    }
  });

  it('getting-started and related-work paths remain available on every route', () => {
    // Toolkit: InstallConsole + EcosystemContext + CommunityWorkshopLink.
    const toolkit = readSource('src/features/agent-toolkit/components/InstallConsole.astro');
    expect(toolkit).toContain('installSnippets');
    // Workstation: WorldDock get started.
    const workstation = readSource('src/features/workstation/components/WorkstationSystemMap.astro');
    expect(workstation).toContain('Get started');
    // Harness: quick start + crosslinks.
    const harness = readSource('src/pages/agentic-harness/index.astro');
    expect(harness).toContain('harnessQuickStart');
    expect(harness).toContain('harnessCrossLinks');
    // Dotfiles: install command + related nav.
    const dotfiles = readSource('src/features/dotfiles/components/DotfilesWorld.astro');
    expect(dotfiles).toContain('installCurl');
    expect(dotfiles).toContain('/community');
    // V: WorldDock install + community.
    const v = readSource('src/features/v/components/VComputationalLab.astro');
    expect(v).toContain('WorldDock');
    expect(v).toContain('/community');
    // Create Awesome: distribution + contribution steps.
    const ca = readSource('src/features/create-awesome/components/CreateAwesomeWorld.astro');
    expect(ca).toContain('distributionChannels');
    expect(ca).toContain('contributionSteps');
  });

  it('bespoke visual compositions are preserved (no template homogenization)', () => {
    // Each route keeps its distinctive hero/stage structures.
    expect(readSource('src/features/agent-toolkit/components/CapabilityNexus.astro')).toContain('atk-nexus__svg');
    expect(readSource('src/features/workstation/components/WorkstationSystemMap.astro')).toContain('ws-map__svg');
    expect(readSource('src/features/agentic-harness/components/PersistenceCore.astro')).toBeTruthy();
    expect(readSource('src/features/dotfiles/components/SmartColorsAnimation.astro')).toBeTruthy();
    expect(readSource('src/features/v/components/VComputationalLab.astro')).toContain('v-lab__header');
    expect(readSource('src/features/create-awesome/components/CreateAwesomeWorld.astro')).toContain('ca-world__line');
  });

  it('Harness problem-first proposition is preserved (not rewritten)', () => {
    const harness = readSource('src/pages/agentic-harness/index.astro');
    expect(harness).toContain('Your coding agent sessions are temporary');
    expect(harness).toContain('Your workspace should not be');
    expect(harness).toContain('workspace scaffold, not another runtime');
  });

  it('HorneroConfig public name is preserved with /dotfiles canonical', () => {
    const dotfiles = readSource('src/features/dotfiles/components/DotfilesWorld.astro');
    expect(dotfiles).toContain('>HorneroConfig<');
    expect(dotfiles).toContain('reproducible Linux developer environment');
  });

  it('Create Awesome maturity distinction is in the proof data', () => {
    const node = getPortfolioEntryById('create-node-app')!;
    const py = getPortfolioEntryById('create-python-app')!;
    const cv = getPortfolioEntryById('create-vlang-app')!;
    expect(node.proofLines.some((l) => l.text.includes('mature family member'))).toBe(true);
    expect(py.proofLines.some((l) => l.text.toLowerCase().includes('newer'))).toBe(true);
    expect(
      cv.proofLines.some((l) => l.text.toLowerCase().includes('newer') || l.text.toLowerCase().includes('early')),
    ).toBe(true);
  });
});
