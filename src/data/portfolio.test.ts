import { describe, expect, it } from 'vitest';
import {
  getHomepageFlagships,
  getLabAndDemo,
  getPortfolioAreaById,
  getPortfolioEntriesByArea,
  getPortfolioEntriesByTier,
  getSelectedWork,
  portfolioAreas,
  portfolioEntries,
  validatePortfolio,
} from '@/data/portfolio';

describe('portfolio taxonomy', () => {
  it('has exactly four flagship areas', () => {
    expect(portfolioAreas).toHaveLength(4);
    expect(portfolioAreas.map((a) => a.id)).toEqual(['agentic', 'horneroconfig', 'v-ecosystem', 'create-awesome']);
  });

  it('passes full validation with no errors', () => {
    expect(validatePortfolio()).toEqual([]);
  });

  it('every entry passes the Zod schema', () => {
    for (const entry of portfolioEntries) {
      // validatePortfolio already catches schema failures, but assert directly for clarity
      const errors = validatePortfolio().filter((e) => e.startsWith(`[${entry.id}]`));
      expect(errors, `entry ${entry.id} should have no validation errors`).toEqual([]);
    }
  });

  it('agentic area contains Toolkit, Workstation, and Harness as members', () => {
    const agentic = getPortfolioAreaById('agentic');
    expect(agentic).toBeDefined();
    expect(agentic!.memberIds).toContain('agent-toolkit');
    expect(agentic!.memberIds).toContain('agentic-workstation');
    expect(agentic!.memberIds).toContain('agentic-harness');
    expect(agentic!.memberIds).not.toContain('horneroconfig');
  });

  it('agentic workstation demo is lab-demo tier and not homepage eligible', () => {
    const demo = portfolioEntries.find((e) => e.id === 'agentic-workstation-demo');
    expect(demo).toBeDefined();
    expect(demo!.tier).toBe('lab-demo');
    expect(demo!.homepageEligible).toBe(false);
  });

  it('hello-vsl is lab-demo tier', () => {
    const hello = portfolioEntries.find((e) => e.id === 'hello-vsl');
    expect(hello).toBeDefined();
    expect(hello!.tier).toBe('lab-demo');
    expect(hello!.homepageEligible).toBe(false);
  });

  it('HorneroConfig is the display title with /dotfiles path', () => {
    const entry = portfolioEntries.find((e) => e.id === 'horneroconfig');
    expect(entry).toBeDefined();
    expect(entry!.title).toBe('HorneroConfig');
    expect(entry!.path).toBe('/dotfiles');
    expect(entry!.repositorySlug).toBe('dotfiles');
    expect(entry!.homepageEligible).toBe(true);
    expect(entry!.timeLens).toBe('current-and-proven');
  });

  it('V organization entries have external ownership and non-owner responsibility', () => {
    const vlangEntries = portfolioEntries.filter((e) => e.repositoryOwner === 'vlang');
    expect(vlangEntries.length).toBeGreaterThan(0);
    for (const entry of vlangEntries) {
      expect(entry.responsibility).not.toBe('author-owner');
      expect(['org-member-work', 'primary-maintainer', 'maintainer', 'contributor']).toContain(entry.responsibility);
    }
  });

  it('Create Awesome variants can express different maturity via timeLens', () => {
    const node = portfolioEntries.find((e) => e.id === 'create-node-app');
    const py = portfolioEntries.find((e) => e.id === 'create-python-app');
    const v = portfolioEntries.find((e) => e.id === 'create-vlang-app');
    expect(node!.timeLens).toBe('current-and-proven');
    expect(py!.timeLens).toBe('current');
    expect(v!.timeLens).toBe('current');
  });

  it('Recoil DevTools is selected work with maintainer role and not archived', () => {
    const recoil = portfolioEntries.find((e) => e.id === 'recoil-devtools');
    expect(recoil).toBeDefined();
    expect(recoil!.tier).toBe('selected-work');
    expect(recoil!.responsibility).toBe('maintainer');
    expect(recoil!.timeLens).toBe('proven');
    expect(recoil!.homepageEligible).toBe(false);
    // Its description should mention upstream archive context
    expect(recoil!.description.toLowerCase()).toContain('archived');
  });

  it('no lab-demo or supporting-resource entry is homepage eligible', () => {
    const ineligible = portfolioEntries.filter(
      (e) => e.tier === 'lab-demo' || e.tier === 'supporting-resource' || e.tier === 'archive',
    );
    for (const entry of ineligible) {
      expect(entry.homepageEligible, `${entry.id} should not be homepage eligible`).toBe(false);
    }
  });

  it('no external-project entry is owned by ulises-jeremias', () => {
    for (const entry of portfolioEntries) {
      if (entry.responsibility === 'external-project') {
        expect(entry.repositoryOwner).not.toBe('ulises-jeremias');
      }
    }
  });

  it('generated-snapshot evidence always carries verifiedAt', () => {
    for (const entry of portfolioEntries) {
      if (entry.evidence.sourceType === 'generated-snapshot') {
        expect(entry.evidence.verifiedAt).toBeDefined();
      }
    }
  });

  it('getHomepageFlagships returns areas with at least one eligible entry', () => {
    const flagships = getHomepageFlagships();
    expect(flagships.length).toBeGreaterThan(0);
    expect(flagships.length).toBeLessThanOrEqual(4);
    for (const area of flagships) {
      const entries = getPortfolioEntriesByArea(area.id);
      expect(entries.some((e) => e.homepageEligible)).toBe(true);
    }
  });

  it('getSelectedWork includes Recoil DevTools', () => {
    const selected = getSelectedWork();
    expect(selected.some((e) => e.id === 'recoil-devtools')).toBe(true);
  });

  it('getLabAndDemo includes demo and hello-vsl', () => {
    const labs = getLabAndDemo();
    expect(labs.some((e) => e.id === 'agentic-workstation-demo')).toBe(true);
    expect(labs.some((e) => e.id === 'hello-vsl')).toBe(true);
  });

  it('getPortfolioEntriesByTier returns the correct subset', () => {
    const flagshipComponents = getPortfolioEntriesByTier('flagship-component');
    expect(flagshipComponents.length).toBeGreaterThan(0);
    for (const entry of flagshipComponents) {
      expect(entry.tier).toBe('flagship-component');
    }
  });

  describe('contextual proof lines (#399)', () => {
    it('volatile proof kinds always carry verifiedAt', () => {
      const volatileKinds = new Set(['release', 'maintenance', 'channel-freshness']);
      for (const entry of portfolioEntries) {
        for (const [index, line] of entry.proofLines.entries()) {
          if (volatileKinds.has(line.kind)) {
            expect(
              line.verifiedAt,
              `${entry.id} proofLines[${index}] "${line.kind}" requires verifiedAt`,
            ).toBeDefined();
          }
        }
      }
    });

    it('ecosystem-scale proof only appears on externally owned entries', () => {
      for (const entry of portfolioEntries) {
        for (const line of entry.proofLines) {
          if (line.kind === 'ecosystem-scale') {
            expect(entry.repositoryOwner, `${entry.id} ecosystem-scale requires external owner`).not.toBe(
              'ulises-jeremias',
            );
          }
        }
      }
    });

    it('proof text never presents raw popularity metrics as value scores', () => {
      const forbiddenPatterns = [/\d+\s+stars\b/i, /\d+\s+forks\b/i, /\d+\s+downloads?\b/i, /\d+\s+users\b/i];
      for (const entry of portfolioEntries) {
        for (const line of entry.proofLines) {
          for (const pattern of forbiddenPatterns) {
            expect(line.text, `${entry.id} proof line must not contain popularity metrics: ${line.text}`).not.toMatch(
              pattern,
            );
          }
        }
      }
    });

    it('flagship entries carry at least one proof line for adoption context', () => {
      const proofEntryIds = ['horneroconfig', 'agent-toolkit', 'recoil-devtools', 'create-node-app'];
      for (const id of proofEntryIds) {
        const entry = portfolioEntries.find((e) => e.id === id);
        expect(entry, `${id} exists`).toBeDefined();
        expect(entry!.proofLines.length, `${id} has contextual proof lines`).toBeGreaterThan(0);
      }
    });

    it('V ecosystem-scale proof attributes scale to the vlang organization', () => {
      const v = portfolioEntries.find((e) => e.id === 'v');
      expect(v).toBeDefined();
      const scaleLine = v!.proofLines.find((line) => line.kind === 'ecosystem-scale');
      expect(scaleLine).toBeDefined();
      expect(scaleLine!.text.toLowerCase()).toContain('organization');
      expect(scaleLine!.text.toLowerCase()).not.toContain('my project');
    });
  });
});
