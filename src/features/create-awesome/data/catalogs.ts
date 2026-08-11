/**
 * Presentation projection of the pinned generated Create Awesome snapshot.
 * Inventory IDs, order, names, descriptions, counts, and source URLs come from
 * compatibility.json. Only featured defaults and coarse UI categories are
 * website-owned presentation choices.
 */
import { createAwesomeCompatibilitySnapshot } from './compatibility.js';
import type { AddonSummary, TemplateSummary, VariantId } from '../types/index.js';

export interface FamilyCatalog {
  id: VariantId;
  source: string;
  templateCount: number;
  addonCount: number;
  templates: TemplateSummary[];
  addons: AddonSummary[];
}

const featuredTemplates: Record<VariantId, string> = {
  node: 'react-vite-boilerplate',
  python: 'fastapi-starter',
  v: 'web-server',
};

const conciseDescription = (description: string): string => {
  const firstSentence = description.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? description;
  const concise = firstSentence.replace(/[.!?]$/, '');
  return concise.length > 140 ? `${concise.slice(0, 139)}…` : concise;
};

const humanizeVId = (id: string): string =>
  id
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');

const presentationCategory = (
  family: VariantId,
  category: string | null,
  labels: string[],
): AddonSummary['category'] => {
  if (family === 'node') {
    if (category === 'UI') return 'styling';
    if (['Database', 'Cross Platform', 'Data Fetching'].includes(category ?? '')) return 'data';
    if (category === 'Deployment') return 'deploy';
    return 'tooling';
  }
  if (family === 'python') {
    if (category === 'database') return 'data';
    if (category === 'containers') return 'deploy';
    return 'tooling';
  }
  if (labels.includes('database')) return 'data';
  if (labels.includes('docker') || labels.includes('devcontainer')) return 'deploy';
  return 'tooling';
};

export const familyCatalogs = Object.fromEntries(
  createAwesomeCompatibilitySnapshot.families.map((family) => {
    const id = family.id;
    const templates = [...family.templates]
      .sort((left, right) => left.sourceOrder - right.sourceOrder)
      .map<TemplateSummary>((template) => ({
        id: template.id,
        name: id === 'v' ? humanizeVId(template.name) : template.name,
        description: conciseDescription(template.description),
        stack: template.labels.slice(0, 3),
        ...(template.id === featuredTemplates[id] ? { featured: true } : {}),
      }));
    const addons = [...family.addons]
      .sort((left, right) => left.sourceOrder - right.sourceOrder)
      .map<AddonSummary>((addon) => ({
        id: addon.id,
        name: id === 'v' ? humanizeVId(addon.name) : addon.name,
        description: conciseDescription(addon.description),
        category: presentationCategory(id, addon.category, addon.labels),
      }));

    return [
      id,
      {
        id,
        source: family.provenance.registry.url,
        templateCount: templates.length,
        addonCount: addons.length,
        templates,
        addons,
      },
    ];
  }),
) as Record<VariantId, FamilyCatalog>;
