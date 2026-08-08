import { overridesById } from './overrides.js';
import { type EvidenceItem, type EvidenceKind, type GithubEvidenceCache, githubEvidenceCacheSchema } from './schema.js';
import cacheJson from '../generated/github-evidence.json';

const parsedCache = githubEvidenceCacheSchema.parse(cacheJson);

function applyOverrides(items: EvidenceItem[]): EvidenceItem[] {
  return items
    .map((item) => {
      const override = overridesById.get(item.id);
      if (!override) return item;
      return {
        ...item,
        featured: override.featured ?? item.featured,
        hidden: override.hidden ?? item.hidden,
        role: override.role ?? item.role,
        summary: override.summary ?? item.summary,
        evidence: override.evidence ?? item.evidence,
        provenance: item.provenance === 'GENERATED_GITHUB_SOURCE' ? item.provenance : item.provenance,
      };
    })
    .filter((item) => !item.hidden);
}

export const githubEvidenceCache: GithubEvidenceCache = parsedCache;

/** Visible evidence rows after editorial overrides. */
export const evidenceItems: EvidenceItem[] = applyOverrides(parsedCache.evidence);

export const featuredEvidence: EvidenceItem[] = evidenceItems.filter((item) => item.featured);

export const evidenceByKind: Record<EvidenceKind, EvidenceItem[]> = {
  owned: evidenceItems.filter((i) => i.kind === 'owned'),
  maintained: evidenceItems.filter((i) => i.kind === 'maintained'),
  org: evidenceItems.filter((i) => i.kind === 'org'),
  external: evidenceItems.filter((i) => i.kind === 'external'),
};

export function getEvidenceLastUpdated(): string {
  return parsedCache.generatedAt;
}

export function getEvidenceNotes(): string[] {
  return parsedCache.notes;
}

/** Constellation nodes — one per visible evidence subject (no fake metrics). */
export type ConstellationNode = {
  id: string;
  label: string;
  kind: EvidenceKind;
  href: string;
  featured: boolean;
};

export function getConstellationNodes(items: EvidenceItem[] = evidenceItems): ConstellationNode[] {
  return items.map((item) => ({
    id: item.id,
    label: item.subject.split('/')[1] ?? item.subject,
    kind: item.kind,
    href: item.href,
    featured: item.featured,
  }));
}
