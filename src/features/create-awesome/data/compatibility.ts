import snapshotJson from './generated/compatibility.json';
import type { VariantId } from '../types/index.js';

export type CompatibilityAdapter =
  'typed-intersection' | 'typed-intersection-with-all' | 'explicit-compatible-with-or-all';

export interface CompatibilityTemplate {
  id: string;
  sourceId: string;
  sourceOrder: number;
  name: string;
  description: string;
  sourceUrl: string;
  category: string | null;
  labels: string[];
  typeIds: string[];
}

export interface CompatibilityAddon extends CompatibilityTemplate {
  declaredCompatibleTemplateIds: string[];
  compatibleTemplateIds: string[];
  incompatibleTemplateIds: string[];
  declaredIncompatibleAddonIds: string[];
  incompatibleAddonIds: string[];
}

export interface CompatibilityFamily {
  id: VariantId;
  adapter: CompatibilityAdapter;
  templates: CompatibilityTemplate[];
  addons: CompatibilityAddon[];
  counts: {
    templates: number;
    addons: number;
    compatibilityEdges: number;
  };
  provenance: {
    repository: string;
    commit: string;
    commitDate: string;
    registry: { path: string; url: string; gitBlobSha: string; sha256: string };
    schema: { path: string; url: string; gitBlobSha: string; sha256: string };
    cliReference: { repository: string; commit: string; commitDate: string };
    semanticReferences: Array<{
      role: string;
      repository: string;
      commit: string;
      commitDate: string;
      path: string;
      url: string;
      gitBlobSha: string;
      sha256: string;
    }>;
  };
}

export interface CreateAwesomeCompatibilitySnapshot {
  schemaVersion: 1;
  normalizationVersion: 1;
  generatedBy: 'pnpm data:create-awesome:refresh';
  notice: 'DO NOT EDIT MANUALLY';
  families: CompatibilityFamily[];
}

export type CompositionValidationIssueCode =
  'unknown-family' | 'unknown-template' | 'unknown-addon' | 'template-addon-incompatible' | 'addon-pair-incompatible';

export interface CompositionValidationIssue {
  code: CompositionValidationIssueCode;
  message: string;
  familyId: string;
  templateId?: string;
  addonId?: string;
  conflictingAddonId?: string;
}

export interface CompositionValidationResult {
  valid: boolean;
  issues: CompositionValidationIssue[];
}

export const createAwesomeCompatibilitySnapshot = snapshotJson as CreateAwesomeCompatibilitySnapshot;

const families = new Map(createAwesomeCompatibilitySnapshot.families.map((family) => [family.id, family]));

export const getCompatibilityFamily = (familyId: string): CompatibilityFamily | undefined =>
  families.get(familyId as VariantId);

export const isTemplateAddonCompatible = (familyId: string, templateId: string, addonId: string): boolean => {
  const family = getCompatibilityFamily(familyId);
  const addon = family?.addons.find((candidate) => candidate.id === addonId);
  return Boolean(
    family?.templates.some((candidate) => candidate.id === templateId) &&
    addon?.compatibleTemplateIds.includes(templateId),
  );
};

export const getCompatibleAddons = (familyId: string, templateId: string): CompatibilityAddon[] => {
  const family = getCompatibilityFamily(familyId);
  if (!family?.templates.some((template) => template.id === templateId)) return [];
  return family.addons.filter((addon) => addon.compatibleTemplateIds.includes(templateId));
};

export const validateComposition = ({
  familyId,
  templateId,
  addonIds,
}: {
  familyId: string;
  templateId: string;
  addonIds: string[];
}): CompositionValidationResult => {
  const issues: CompositionValidationIssue[] = [];
  const family = getCompatibilityFamily(familyId);
  if (!family) {
    return {
      valid: false,
      issues: [{ code: 'unknown-family', familyId, message: `Unknown Create Awesome family: ${familyId}` }],
    };
  }

  const template = family.templates.find((candidate) => candidate.id === templateId);
  if (!template) {
    issues.push({
      code: 'unknown-template',
      familyId,
      templateId,
      message: `Unknown ${familyId} template: ${templateId}`,
    });
  }

  const selectedAddons: CompatibilityAddon[] = [];
  for (const addonId of [...new Set(addonIds)]) {
    const addon = family.addons.find((candidate) => candidate.id === addonId);
    if (!addon) {
      issues.push({
        code: 'unknown-addon',
        familyId,
        addonId,
        message: `Unknown ${familyId} addon: ${addonId}`,
      });
      continue;
    }
    selectedAddons.push(addon);
    if (template && !addon.compatibleTemplateIds.includes(template.id)) {
      issues.push({
        code: 'template-addon-incompatible',
        familyId,
        templateId: template.id,
        addonId,
        message: `${addonId} is not compatible with ${template.id}`,
      });
    }
  }

  for (let leftIndex = 0; leftIndex < selectedAddons.length; leftIndex += 1) {
    const left = selectedAddons[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < selectedAddons.length; rightIndex += 1) {
      const right = selectedAddons[rightIndex];
      if (left.incompatibleAddonIds.includes(right.id) || right.incompatibleAddonIds.includes(left.id)) {
        issues.push({
          code: 'addon-pair-incompatible',
          familyId,
          addonId: left.id,
          conflictingAddonId: right.id,
          message: `${left.id} cannot be combined with ${right.id}`,
        });
      }
    }
  }

  return { valid: issues.length === 0, issues };
};
