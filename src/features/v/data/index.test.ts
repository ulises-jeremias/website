import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  licenseEntries,
  rxvOperatorGroups,
  SETUP_V_PIN,
  setupVPipeline,
  vProjects,
  vslBackends,
  vSourceFacts,
  vtlMaturity,
} from './index.js';

const getProject = (id: (typeof vProjects)[number]['id']) => vProjects.find((project) => project.id === id)!;
const readSourceFile = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');

describe('V source-fidelity data', () => {
  it('uses the README-recommended setup-v pin and documented action outputs', () => {
    expect(SETUP_V_PIN).toBe('vlang/setup-v@v1.7');
    expect(vSourceFacts.setupV.outputs).toEqual(['bin-path', 'v-bin-path', 'version', 'architecture']);
    expect(vSourceFacts.setupV.cacheRequiresExplicitVersion).toBe(true);
    expect(vSourceFacts.setupV.runnerFamilies).toEqual(['Linux', 'macOS', 'Windows']);
    expect(setupVPipeline.find((step) => step.id === 'arch')?.description).toContain('target architecture');
    expect(setupVPipeline.find((step) => step.id === 'cache')?.description).toContain('explicit version');
    expect(setupVPipeline.find((step) => step.id === 'verify')?.detail).toContain(
      vSourceFacts.setupV.outputs.join(', '),
    );

    const setupDiagram = readSourceFile('../components/SetupVDiagram.astro');
    const ecosystemDiagram = readSourceFile('../components/EcosystemDiagram.astro');

    expect(`${setupDiagram}\n${ecosystemDiagram}`).not.toContain('vlang/setup-v@v1.7');
    expect(setupDiagram).toContain(
      'aria-label="5 Verify — run v version and expose bin-path, v-bin-path, version, and architecture outputs"',
    );
    for (const output of vSourceFacts.setupV.outputs) {
      expect(setupDiagram).toContain(`>${output}</text>`);
    }
  });

  it('publishes only the current RxV operator catalog', () => {
    expect(rxvOperatorGroups).toEqual(vSourceFacts.rxv.operatorGroups);

    const operators = rxvOperatorGroups.flatMap((group) => group.operators);
    expect(operators).toEqual(
      expect.arrayContaining([
        'from_channel',
        'flat_map_',
        'concat_map_',
        'scan_',
        'count_',
        'debounce_',
        'average_f64',
        'observe',
      ]),
    );
    expect(operators).not.toEqual(expect.arrayContaining(['buffer', 'group_by', 'zip', 'combine_latest', 'retry']));
    expect(vSourceFacts.rxv.completion).toBe('channel closure');
    expect(vSourceFacts.rxv.defaultBufferSize).toBe(0);
  });

  it('keeps VSL and VTL maturity claims operation-scoped', () => {
    expect(vslBackends.find((backend) => backend.id === 'cblas')?.maturity).toBe('optional');
    expect(vslBackends.find((backend) => backend.id === 'pure-v')?.bestFor).toContain('QR');
    expect(vtlMaturity.find((backend) => backend.id === 'cpu')?.note).toContain('beta');
    expect(vtlMaturity.find((backend) => backend.id === 'cuda')?.note).toContain('experimental');
    expect(vtlMaturity.find((backend) => backend.id === 'vulkan')?.note).toContain('selected Conv2D');
    expect(getProject('vtl').description).toContain('backed by VSL');
  });

  it('keeps each upstream license independently sourced', () => {
    expect(getProject('v').license).toBe('MIT');
    expect(getProject('vsl').license).toBe('MIT');
    expect(getProject('vtl').license).toBe('MIT');
    expect(getProject('rxv').license).toBe('MIT');
    expect(getProject('setup-v').license).toBe('MIT');
    expect(getProject('awesome-v').license).toBe('CC0 1.0');

    const mascot = licenseEntries.find((entry) => entry.component.includes('mascot'))!;
    expect(mascot.license).toBe('CC BY-NC 4.0');
    expect(mascot.notes).toContain('ships no Veasel asset');
    expect(mascot.notes).toContain('attribution and change notices');
    expect(mascot.notes).toContain('trademark rights are not granted');
  });

  it('does not reintroduce contradicted V ecosystem claims', () => {
    const sourceFiles = [
      './index.ts',
      '../components/EcosystemDiagram.astro',
      '../components/VSLDiagram.astro',
      '../components/VTLDiagram.astro',
      '../components/RxVDiagram.astro',
      '../components/SetupVDiagram.astro',
      '../components/scenes/SetupVScene.astro',
    ].map(readSourceFile);
    const text = sourceFiles.join('\n');

    for (const contradictedClaim of [
      'Every Tensor[T] is a view',
      'benchmarks prove parity',
      'prove CPU paths',
      'All projects MIT',
      'is_closed: true',
      'v-version: 0.4.9',
      'cache-hit: true',
      'CI goes from ~40s to ~4s',
      'no build unless you ask',
      'No token needed for tags',
    ]) {
      expect(text).not.toContain(contradictedClaim);
    }
  });
});
