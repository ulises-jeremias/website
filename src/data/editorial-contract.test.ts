import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { portfolioAreas, portfolioEntries, validatePortfolio } from '@/data/portfolio';

const contractPath = join(process.cwd(), 'docs/design/current/editorial-contract.md');

describe('flagship editorial contract', () => {
  it('contract document exists', () => {
    const content = readFileSync(contractPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('contract defines the nine visitor questions', () => {
    const content = readFileSync(contractPath, 'utf-8');
    const questions = [
      'What problem does this work address?',
      'What is it?',
      'Why does it matter?',
      'What evidence shows it working?',
      'How is it designed or composed?',
      'What proof/maturity/distribution context is supported?',
      "What is Ulises's role and who owns the repository?",
      'How does someone get started or contribute?',
      'What related work should they inspect next?',
    ];
    for (const q of questions) {
      expect(content, `contract must include question: ${q}`).toContain(q);
    }
  });

  it('contract references the portfolio taxonomy as the source for shared fields', () => {
    const content = readFileSync(contractPath, 'utf-8');
    expect(content).toContain('src/data/portfolio.ts');
    expect(content).toContain('repositoryOwner');
    expect(content).toContain('responsibility');
  });

  it('contract covers all four flagship areas', () => {
    const content = readFileSync(contractPath, 'utf-8');
    for (const area of portfolioAreas) {
      expect(content, `contract must reference area route ${area.path}`).toContain(area.path);
    }
  });

  it('contract references every flagship detail route', () => {
    const content = readFileSync(contractPath, 'utf-8');
    const detailRoutes = [
      '/agent-toolkit',
      '/agentic-workstation',
      '/agentic-harness',
      '/dotfiles',
      '/v',
      '/create-awesome',
    ];
    for (const route of detailRoutes) {
      expect(content, `contract must reference route ${route}`).toContain(route);
    }
  });

  it('portfolio taxonomy validates cleanly (precondition for provenance fields)', () => {
    expect(validatePortfolio()).toEqual([]);
  });

  it('every flagship-component entry has a description with provenance-enabling data', () => {
    const flagshipComponents = portfolioEntries.filter((e) => e.tier === 'flagship-component');
    expect(flagshipComponents.length).toBeGreaterThan(0);
    for (const entry of flagshipComponents) {
      expect(entry.description.length).toBeGreaterThan(0);
      expect(entry.repositoryOwner.length).toBeGreaterThan(0);
      expect(entry.repositorySlug.length).toBeGreaterThan(0);
      expect(entry.evidence.sourceUrl).toMatch(/^https?:\/\//);
    }
  });

  it('every flagship-component entry has a channel list or empty array', () => {
    const flagshipComponents = portfolioEntries.filter((e) => e.tier === 'flagship-component');
    for (const entry of flagshipComponents) {
      expect(Array.isArray(entry.channels)).toBe(true);
    }
  });
});
