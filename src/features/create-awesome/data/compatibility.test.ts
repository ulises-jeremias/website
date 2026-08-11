import { describe, expect, it } from 'vitest';
import { familyCatalogs } from './catalogs.js';
import {
  createAwesomeCompatibilitySnapshot,
  getCompatibleAddons,
  isTemplateAddonCompatible,
  validateComposition,
} from './compatibility.js';

describe('pinned Create Awesome compatibility data', () => {
  it('pins exactly the three supported families', () => {
    expect(createAwesomeCompatibilitySnapshot.families.map((family) => family.id).sort()).toEqual([
      'node',
      'python',
      'v',
    ]);
  });

  it('carries immutable provenance and derived counts for every family', () => {
    for (const family of createAwesomeCompatibilitySnapshot.families) {
      expect(family.provenance.commit).toMatch(/^[0-9a-f]{40}$/);
      expect(family.provenance.registry.url).toContain(`/${family.provenance.commit}/`);
      expect(family.provenance.registry.gitBlobSha).toMatch(/^[0-9a-f]{40}$/);
      expect(family.provenance.registry.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(family.provenance.schema.url).toContain(`/${family.provenance.commit}/`);
      expect(family.provenance.cliReference.commit).toMatch(/^[0-9a-f]{40}$/);
      expect(family.counts.templates).toBe(family.templates.length);
      expect(family.counts.addons).toBe(family.addons.length);
      expect(family.counts.compatibilityEdges).toBe(
        family.addons.reduce((total, addon) => total + addon.compatibleTemplateIds.length, 0),
      );
    }
  });

  it('projects generated inventory into the existing presentation order', () => {
    for (const family of createAwesomeCompatibilitySnapshot.families) {
      const expectedTemplates = [...family.templates]
        .sort((left, right) => left.sourceOrder - right.sourceOrder)
        .map((template) => template.id);
      const expectedAddons = [...family.addons]
        .sort((left, right) => left.sourceOrder - right.sourceOrder)
        .map((addon) => addon.id);
      expect(familyCatalogs[family.id].templates.map((template) => template.id)).toEqual(expectedTemplates);
      expect(familyCatalogs[family.id].addons.map((addon) => addon.id)).toEqual(expectedAddons);
      expect(familyCatalogs[family.id].templateCount).toBe(expectedTemplates.length);
      expect(familyCatalogs[family.id].addonCount).toBe(expectedAddons.length);
      expect(familyCatalogs[family.id].source).toContain(`/${family.provenance.commit}/`);
    }
  });

  it('keeps website-owned featured defaults and source category mappings resolvable', () => {
    for (const family of createAwesomeCompatibilitySnapshot.families) {
      expect(familyCatalogs[family.id].templates.filter((template) => template.featured)).toHaveLength(1);
    }

    const categoryCases = [
      { familyId: 'node', sourceCategory: 'UI', presentationCategory: 'styling' },
      { familyId: 'node', sourceCategory: 'Database', presentationCategory: 'data' },
      { familyId: 'node', sourceCategory: 'Cross Platform', presentationCategory: 'data' },
      { familyId: 'node', sourceCategory: 'Data Fetching', presentationCategory: 'data' },
      { familyId: 'node', sourceCategory: 'Deployment', presentationCategory: 'deploy' },
      { familyId: 'python', sourceCategory: 'database', presentationCategory: 'data' },
      { familyId: 'python', sourceCategory: 'containers', presentationCategory: 'deploy' },
    ] as const;
    for (const expected of categoryCases) {
      const sourceFamily = createAwesomeCompatibilitySnapshot.families.find(
        (family) => family.id === expected.familyId,
      );
      const matchingAddons = sourceFamily?.addons.filter((addon) => addon.category === expected.sourceCategory) ?? [];
      expect(matchingAddons.length).toBeGreaterThan(0);
      for (const addon of matchingAddons) {
        expect(familyCatalogs[expected.familyId].addons.find((candidate) => candidate.id === addon.id)?.category).toBe(
          expected.presentationCategory,
        );
      }
    }

    const vFamily = createAwesomeCompatibilitySnapshot.families.find((family) => family.id === 'v');
    const vDatabaseAddons = vFamily?.addons.filter((addon) => addon.labels.includes('database')) ?? [];
    const vDeployAddons =
      vFamily?.addons.filter(
        (addon) =>
          !addon.labels.includes('database') &&
          (addon.labels.includes('docker') || addon.labels.includes('devcontainer')),
      ) ?? [];
    expect(vDatabaseAddons.length).toBeGreaterThan(0);
    expect(vDeployAddons.length).toBeGreaterThan(0);
    for (const addon of vDatabaseAddons) {
      expect(familyCatalogs.v.addons.find((candidate) => candidate.id === addon.id)?.category).toBe('data');
    }
    for (const addon of vDeployAddons) {
      expect(familyCatalogs.v.addons.find((candidate) => candidate.id === addon.id)?.category).toBe('deploy');
    }
  });

  it('uses Node type intersection and source-backed addon conflicts', () => {
    expect(isTemplateAddonCompatible('node', 'react-vite-boilerplate', 'tailwind-css')).toBe(true);
    expect(isTemplateAddonCompatible('node', 'react-vite-boilerplate', 'nextjs-tailwindcss')).toBe(false);
    expect(isTemplateAddonCompatible('node', 'nextjs-starter', 'github-setup')).toBe(true);
    expect(isTemplateAddonCompatible('node', 'turborepo-boilerplate', 'github-setup')).toBe(true);

    const result = validateComposition({
      familyId: 'node',
      templateId: 'react-vite-boilerplate',
      addonIds: ['react-redux-saga', 'react-redux-thunk'],
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: 'addon-pair-incompatible',
        addonId: 'react-redux-saga',
        conflictingAddonId: 'react-redux-thunk',
      }),
    );
  });

  it('uses Python direct and multi-type intersection for the pinned catalog', () => {
    expect(isTemplateAddonCompatible('python', 'fastapi-starter', 'fastapi-cors')).toBe(true);
    expect(isTemplateAddonCompatible('python', 'cli-starter', 'fastapi-cors')).toBe(false);
    expect(isTemplateAddonCompatible('python', 'fastapi-starter', 'github-setup')).toBe(true);
    expect(isTemplateAddonCompatible('python', 'cli-starter', 'github-setup')).toBe(true);
    expect(isTemplateAddonCompatible('python', 'mlops-sklearn-starter', 'github-setup')).toBe(false);
    expect(getCompatibleAddons('python', 'django-api').map((addon) => addon.id)).toContain('django-docker');
  });

  it('uses V compatibleWith and empty-means-all semantics', () => {
    expect(isTemplateAddonCompatible('v', 'vsl-starter', 'vsl-plotting')).toBe(true);
    expect(isTemplateAddonCompatible('v', 'web-server', 'vsl-plotting')).toBe(false);
    expect(isTemplateAddonCompatible('v', 'web-server', 'github-setup')).toBe(true);
    expect(isTemplateAddonCompatible('v', 'rxv-starter', 'github-setup')).toBe(true);
  });

  it('rejects invalid compositions with structured reasons below the UI', () => {
    expect(validateComposition({ familyId: 'missing', templateId: 'x', addonIds: [] }).issues).toEqual([
      expect.objectContaining({ code: 'unknown-family' }),
    ]);

    const result = validateComposition({
      familyId: 'v',
      templateId: 'missing-template',
      addonIds: ['missing-addon', 'vsl-plotting'],
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(['unknown-template', 'unknown-addon']);

    const incompatible = validateComposition({
      familyId: 'v',
      templateId: 'web-server',
      addonIds: ['vsl-plotting'],
    });
    expect(incompatible.issues).toEqual([
      expect.objectContaining({
        code: 'template-addon-incompatible',
        templateId: 'web-server',
        addonId: 'vsl-plotting',
      }),
    ]);
  });
});
