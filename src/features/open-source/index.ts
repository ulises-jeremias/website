/** Open Source feature barrel. */
export { default as Hero } from './components/Hero.astro';
export { default as Constellation } from './components/Constellation.astro';
export { default as EvidenceLedger } from './components/EvidenceLedger.astro';
export {
  evidenceItems,
  featuredEvidence,
  getConstellationNodes,
  getEvidenceLastUpdated,
  getEvidenceNotes,
  githubEvidenceCache,
} from '@/data/open-source/index.js';
export type { EvidenceItem, EvidenceKind, EvidenceRole, GithubEvidenceCache } from '@/data/open-source/schema.js';
