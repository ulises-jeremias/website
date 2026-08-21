/** Open Source feature barrel. */
export { default as Hero } from './components/Hero.astro';
export { default as Constellation } from './components/Constellation.astro';
export { default as EvidenceLedger } from './components/EvidenceLedger.astro';
export {
  evidenceItems,
  featuredEvidence,
  formatEvidenceDate,
  getConstellationNodes,
  getEvidenceKindLabel,
  getEvidenceLastUpdated,
  getEvidenceNotes,
  getEvidenceProvenanceLabel,
  githubEvidenceCache,
} from '@/data/open-source/index.js';
export type { EvidenceItem, EvidenceKind, EvidenceRole, GithubEvidenceCache } from '@/data/open-source/schema.js';
