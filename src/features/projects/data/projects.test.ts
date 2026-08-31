import { describe, expect, it } from 'vitest';
import { getWorldById } from '@/data/project-worlds.js';
import { archivedProjects, getGroupedLedger, projects, validateProjects, worldPointerProjects } from './index.js';

describe('projects ledger', () => {
  it('validates every project against the schema', () => {
    expect(validateProjects()).toEqual([]);
  });

  it('never uses archived as an anti-duplication hack for world projects', () => {
    for (const project of worldPointerProjects) {
      expect(project.status).not.toBe('archived');
      expect(project.visibility).toBe('world');
      expect(project.worldId).toBeTruthy();
      expect(getWorldById(project.worldId!)).toBeTruthy();
    }
  });

  it('archived list contains only truly archived entries', () => {
    for (const project of archivedProjects) {
      expect(project.status).toBe('archived');
    }
  });

  it('groups ledger into Personal DX / Agentic / V / Create Awesome / Dev tools / Experiments', () => {
    const groups = getGroupedLedger();
    const ids = groups.map((g) => g.id);
    expect(ids).toContain('personal-dx');
    expect(ids).toContain('agentic');
    expect(ids).toContain('v');
    expect(ids).toContain('create-awesome');
    expect(ids).toContain('dev-tools');
  });

  it('classifies recoil-devtools as maintained selected work with upstream-archived context (#398)', () => {
    const recoil = projects.find((p) => p.slug === 'recoil-devtools');
    const mascot = projects.find((p) => p.slug === 'vlang-v-mascot');
    expect(recoil).toMatchObject({
      group: 'dev-tools',
      status: 'maintained',
      role: 'maintainer',
      featured: false,
      visibility: 'public',
    });
    // Upstream archive context must be explicit — Recoil DevTools itself is NOT archived.
    expect(recoil?.summary.toLowerCase()).toContain('maintained');
    expect(recoil?.summary.toLowerCase()).toContain('upstream recoil is archived');
    expect(recoil?.lastVerified).toBe('2026-08-31');
    expect(recoil?.metrics).toBeUndefined();
    expect(mascot).toMatchObject({
      featured: false,
      role: 'contributor',
    });
    expect(mascot?.licenseNote).toMatch(/CC BY-NC/i);
  });

  it('uses the canonical Awesome V repository and contributor role', () => {
    const awesomeV = projects.find((project) => project.slug === 'awesome-v');
    expect(awesomeV).toMatchObject({
      role: 'contributor',
      lastVerified: '2026-08-10',
      links: expect.arrayContaining([
        expect.objectContaining({ href: 'https://github.com/vlang/awesome-v', kind: 'repo' }),
        expect.objectContaining({ href: '/v#awesome-v', kind: 'world' }),
      ]),
    });
  });

  it('requires verifiedAt whenever metrics are present', () => {
    for (const project of projects) {
      if (project.metrics) {
        expect(project.metrics.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
        expect(project.metrics.source).toBe('GENERATED_GITHUB_SOURCE');
      }
    }
  });
});
