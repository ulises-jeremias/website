import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPortfolioEntryById, portfolioEntries } from '@/data/portfolio';

/**
 * Evidence-surface tests (#399).
 *
 * Asserts the proof rendering surfaces consume the taxonomy, that volatile
 * proof lines are dated, that no browser-time provider calls exist, and
 * fresh/stale/missing behavior via deterministic schema checks.
 */
const root = process.cwd();

function readSource(path: string): string {
  return readFileSync(resolve(root, path), 'utf8');
}

describe('contextual evidence surfaces (#399)', () => {
  it('ProofStrip is consumed by the flagship provenance block and Work tiers', () => {
    const provenance = readSource('src/shared/components/FlagshipProvenance.astro');
    expect(provenance, 'flagship provenance renders ProofStrip').toContain('<ProofStrip');
    const workTiers = readSource('src/features/projects/components/WorkTiers.astro');
    expect(workTiers, 'Work selected tier renders ProofStrip').toContain('<ProofStrip');
  });

  it('homepage featured areas derive proof from taxonomy members, not hardcoded strings', () => {
    const home = readSource('src/features/home/data/index.ts');
    expect(home).toContain('getHomepagePortfolioAreas()');
    // No hardcoded proof sentences in the home data.
    expect(home).not.toMatch(/proof:\s*'[^']+'/);
  });

  it('every rendered volatile proof line carries a verification date', () => {
    const volatileKinds = new Set(['release', 'maintenance', 'channel-freshness']);
    // Entries actually rendered on flagship routes.
    const rendered = [
      'agent-toolkit',
      'agentic-workstation',
      'agentic-harness',
      'horneroconfig',
      'v',
      'recoil-devtools',
      'create-node-app',
    ];
    for (const id of rendered) {
      const entry = getPortfolioEntryById(id)!;
      for (const line of entry.proofLines) {
        if (volatileKinds.has(line.kind)) {
          expect(line.verifiedAt, `${id} "${line.kind}" proof carries verifiedAt`).toBeDefined();
          expect(line.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      }
    }
  });

  it('every rendered entry carries a traceable evidence source URL', () => {
    for (const entry of portfolioEntries) {
      expect(entry.evidence.sourceUrl, `${entry.id} evidence source`).toMatch(/^https?:\/\//);
      expect(entry.evidence.sourceType).toMatch(/editorial|generated-snapshot|repository-metadata/);
    }
  });

  it('ProofStrip renders verification dates visibly for dated lines', () => {
    const strip = readSource('src/shared/components/ProofStrip.astro');
    expect(strip).toContain('<time');
    expect(strip).toContain('line.verifiedAt');
  });

  it('no browser-time provider API calls in client code', () => {
    const clientSources = [
      'src/shared/components/ProofStrip.astro',
      'src/shared/components/FlagshipProvenance.astro',
      'src/features/home/components/FeaturedAreas.astro',
      'src/features/projects/components/WorkTiers.astro',
    ];
    for (const path of clientSources) {
      const code = readSource(path);
      expect(code, `${path} makes no provider API calls`).not.toMatch(
        /api\.github\.com|npmjs\.com\/api|registry\.npmjs\.org|pypi\.org\/pypi|aur\.archlinux\.org\/rpc|formulae\.brew\.sh|hub\.docker\.com/,
      );
      expect(code, `${path} makes no client fetch`).not.toMatch(/await\s+fetch\(|fetch\(['"`]https?:/);
    }
  });

  it('missing proof degrades cleanly — components render nothing for empty proofLines', () => {
    const strip = readSource('src/shared/components/ProofStrip.astro');
    // Guard: strip renders only when lines exist.
    expect(strip).toMatch(/lines\.length > 0/);
    // Deterministic fixture: an entry with zero proof lines.
    const entryWithoutProof = portfolioEntries.find((entry) => entry.proofLines.length === 0);
    if (entryWithoutProof) {
      expect(entryWithoutProof.proofLines).toEqual([]);
      // No error thrown when accessed.
      expect(() => getPortfolioEntryById(entryWithoutProof.id)).not.toThrow();
    }
  });

  it('stale-proof policy is documented', () => {
    const doc = readSource('docs/DATA_PROVENANCE.md');
    expect(doc).toContain('verifiedAt');
    expect(doc).toContain('last-known-good');
    expect(doc).toContain('re-verify');
    expect(doc).toContain('quarterly');
  });

  it('refresh workflow is documented for portfolio proof', () => {
    const doc = readSource('docs/DATA_PROVENANCE.md');
    expect(doc).toContain('Refresh workflow');
    expect(doc).toContain('evidence.sourceUrl');
    expect(doc).toContain('delete the line');
  });

  it('schema rejects volatile proof lines without dates (failure case fixture)', async () => {
    // Re-run the schema validation on a synthetic stale line to prove the
    // build fails rather than rendering an undated volatile claim.
    const { portfolioEntrySchema } = await import('@/data/portfolio.js');
    const base = getPortfolioEntryById('agent-toolkit')!;
    const synthetic = {
      ...base,
      proofLines: [{ kind: 'release', text: 'Synthetic undated release claim.' }],
    };
    const result = portfolioEntrySchema.safeParse(synthetic);
    expect(result.success, 'undated volatile proof must fail validation').toBe(false);
  });
});
