import { describe, expect, it } from 'vitest';
import { editorialOverrides } from './overrides.js';
import { githubEvidenceCacheSchema } from './schema.js';
import { evidenceItems, getConstellationNodes, getEvidenceLastUpdated, githubEvidenceCache } from './index.js';

describe('open-source evidence pipeline', () => {
  it('parses the committed GitHub evidence cache', () => {
    expect(githubEvidenceCacheSchema.safeParse(githubEvidenceCache).success).toBe(true);
    expect(githubEvidenceCache.schemaVersion).toBe(1);
    expect(githubEvidenceCache.evidence.length).toBeGreaterThan(0);
  });

  it('exposes owned / maintained / org / external kinds without inventing vanity counts', () => {
    const kinds = new Set(evidenceItems.map((item) => item.kind));
    expect(kinds.has('owned')).toBe(true);
    expect(kinds.has('maintained')).toBe(true);
    expect(kinds.has('org')).toBe(true);
    expect(kinds.has('external')).toBe(true);
    expect(githubEvidenceCache.volatile).toEqual({});
  });

  it('applies editorial overrides by id', () => {
    for (const override of editorialOverrides) {
      const row = evidenceItems.find((item) => item.id === override.id);
      if (override.hidden) {
        expect(row).toBeUndefined();
        continue;
      }
      expect(row).toBeTruthy();
      if (override.featured != null) expect(row?.featured).toBe(override.featured);
      if (override.role) expect(row?.role).toBe(override.role);
    }
  });

  it('builds constellation nodes from evidence subjects', () => {
    const nodes = getConstellationNodes();
    expect(nodes.length).toBe(evidenceItems.length);
    expect(getEvidenceLastUpdated()).toBeTruthy();
  });
});
