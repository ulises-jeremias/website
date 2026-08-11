import { describe, expect, it } from 'vitest';
import { variants as createAwesomeVariants } from '@/features/create-awesome/data/index';
import {
  COMMUNITY_ISSUE_SEARCH_BASE,
  communityIssueSearch,
  communityMeta,
  communityProjects,
  incubatingProjects,
  validateCommunityRegistry,
} from './index.js';

describe('community registry', () => {
  it('validates without schema errors', () => {
    expect(validateCommunityRegistry()).toEqual([]);
  });

  it('marks Create Awesome as one family among many — not the only projects', () => {
    const ecosystems = new Set(communityProjects.map((p) => p.ecosystem));
    expect(ecosystems.has('create-awesome')).toBe(true);
    expect(ecosystems.has('personal-dx')).toBe(true);
    expect(ecosystems.has('agentic')).toBe(true);
    expect(ecosystems.has('v-ecosystem')).toBe(true);
    expect(communityProjects.some((p) => p.id === 'agentic-harness')).toBe(true);
    expect(communityProjects.some((p) => p.id === 'horneroconfig')).toBe(true);
  });

  it('keeps incubating projects URL-free and public-only', () => {
    for (const item of incubatingProjects) {
      expect(item.public).toBe(true);
      expect(JSON.stringify(item)).not.toMatch(/https?:\/\//);
      expect(item.workingTitle.toLowerCase()).not.toContain('sin nombre');
    }
    expect(incubatingProjects.map((i) => i.id)).toEqual(
      expect.arrayContaining(['skypiea-home', 'horneroos', 'agent-workspace-experiment']),
    );
  });

  it('uses a verified Discord invite and multi-repo issue search', () => {
    expect(communityMeta.discordInviteUrl).toBe('https://discord.gg/bR5VyATgka');
    expect(COMMUNITY_ISSUE_SEARCH_BASE).toContain('agentic-harness');
    expect(COMMUNITY_ISSUE_SEARCH_BASE).toContain('Create-Node-App');
    expect(communityIssueSearch('label:documentation')).toContain('github.com/search');
    expect(communityIssueSearch('label:documentation')).not.toContain('ulises-jeremias/website');
  });

  it('does not invent a universal CoC claim in meta', () => {
    expect(communityMeta.exampleCodeOfConductUrl).toContain('Create-Node-App');
  });

  it('keeps Create Awesome community destinations on canonical family fragments', () => {
    const createProjects = communityProjects.filter((project) => project.ecosystem === 'create-awesome');
    expect(createProjects.map((project) => project.worldPath)).toEqual(
      createAwesomeVariants.map((variant) => `/create-awesome#${variant.id}`),
    );
  });
});
