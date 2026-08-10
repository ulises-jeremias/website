import { describe, expect, it } from 'vitest';
import { githubEvidenceCache } from '@/data/open-source/index.js';
import { toolkitOverview } from '@/features/agent-toolkit/data/index.js';
import { workstationLayers } from '@/features/workstation/data/index.js';
import { personalDxRelationships, validatePersonalDxRelationships } from './personal-dx-relationships.js';

describe('personal DX factual relationship registry', () => {
  it('validates source-backed relationships without presentation taxonomy', () => {
    expect(validatePersonalDxRelationships()).toHaveLength(3);
    for (const relation of personalDxRelationships) {
      expect(relation.verb).not.toMatch(/layer|level|step|phase/i);
      expect(relation).not.toHaveProperty('coordinates');
      expect(relation).not.toHaveProperty('rank');
      expect(relation).not.toHaveProperty('parentLayer');
    }
  });

  it('keeps the approved responsibility verbs explicit', () => {
    expect(personalDxRelationships.map(({ source, target, verb }) => `${source} ${verb} ${target}`)).toEqual([
      'agentic-workstation can provision host dependencies for agent-toolkit',
      'agent-toolkit provides capabilities and workspace commands to agentic-harness',
      'hornero-config optionally coexists with agentic-workstation',
    ]);
  });

  it('does not reintroduce numeric Personal DX taxonomy into public data copy', () => {
    const publicCopy = JSON.stringify({
      layers: workstationLayers.map(({ label, mapping, description }) => ({ label, mapping, description })),
      overview: toolkitOverview,
      evidence: githubEvidenceCache.evidence,
    });
    expect(publicCopy).not.toMatch(/\bL(?:0|1|1\.5|2)\b/i);
  });
});
