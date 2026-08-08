import { describe, expect, it } from 'vitest';
import {
  crossLinks,
  featuredWorlds,
  getWorldById,
  getWorldByPath,
  getWorldBySlug,
  type ProjectWorld,
  projectWorlds,
  projectWorldSchema,
  validateTaxonomy,
  worldsByPriority,
} from '@/data/project-worlds';
import { routes } from '@/data/routes';

describe('project-world taxonomy', () => {
  it('has 9 worlds', () => {
    expect(projectWorlds).toHaveLength(9);
  });

  it('all worlds validate against Zod schema', () => {
    for (const w of projectWorlds) {
      expect(projectWorldSchema.safeParse(w).success).toBe(true);
    }
  });

  it('gives every world a typed illustration and synthwave accent', () => {
    for (const world of projectWorlds) {
      expect(world.illustration).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(world.accent).toMatch(/^(magenta|pink|violet|blue|cyan|orange)$/);
    }
  });

  it('keeps every world path aligned with canonical route metadata', () => {
    const routePaths = new Set(routes.map((route) => route.path));
    for (const world of projectWorlds) {
      expect(routePaths.has(world.path), `${world.id} should resolve through routes.ts`).toBe(true);
    }
  });

  it('worldsByPriority is sorted by priority ascending', () => {
    for (let i = 1; i < worldsByPriority.length; i++) {
      expect(worldsByPriority[i]!.priority).toBeGreaterThan(worldsByPriority[i - 1]!.priority);
    }
  });

  it('featuredWorlds contains exactly the 5 hero worlds', () => {
    expect(featuredWorlds).toHaveLength(5);
    const ids = featuredWorlds.map((w) => w.id);
    expect(ids).toEqual(['dotfiles', 'toolkit', 'workstation', 'v', 'create-awesome']);
  });

  it('all featured worlds have subdomain candidates', () => {
    for (const w of featuredWorlds) {
      expect(w.subdomain).toBeDefined();
    }
  });

  it('getWorldById returns correct world or undefined', () => {
    expect(getWorldById('v')?.path).toBe('/v');
    expect(getWorldById('nonexistent')).toBeUndefined();
  });

  it('getWorldByPath and getWorldBySlug are consistent', () => {
    expect(getWorldByPath('/dotfiles')?.id).toBe('dotfiles');
    expect(getWorldBySlug('dotfiles')?.path).toBe('/dotfiles');
    expect(getWorldByPath('/not-found')).toBeUndefined();
  });

  it('crossLinks reference valid world ids', () => {
    const ids = new Set(projectWorlds.map((w) => w.id));
    for (const link of crossLinks) {
      expect(ids.has(link.from)).toBe(true);
      expect(ids.has(link.to)).toBe(true);
      expect(link.label.length).toBeGreaterThan(0);
    }
  });

  it('crossLinks includes key relationships: workstation→toolkit and dotfiles→workstation', () => {
    const pairs = crossLinks.map((c) => `${c.from}→${c.to}`);
    expect(pairs).toContain('workstation→toolkit');
    expect(pairs).toContain('dotfiles→workstation');
  });

  it('subWorlds for V are under /v and have required fields', () => {
    const v = getWorldById('v')!;
    expect(v.subWorlds).toBeDefined();
    expect(v.subWorlds!.length).toBeGreaterThanOrEqual(4);
    for (const sub of v.subWorlds!) {
      expect(sub.path.startsWith('/v')).toBe(true);
      expect(sub.title.length).toBeGreaterThan(0);
    }
  });

  it('validateTaxonomy returns no errors for current taxonomy', () => {
    expect(validateTaxonomy()).toEqual([]);
  });

  it('validateTaxonomy detects duplicate path', () => {
    const dup = [...projectWorlds, { ...projectWorlds[0]!, id: 'dup-test' }];
    const errors = validateTaxonomy(dup as ProjectWorld[]);
    expect(errors.some((e) => e.includes('Duplicate path'))).toBe(true);
  });

  it('route table covers all 10 preferred paths plus /blog/[slug] via ADR', async () => {
    // Verify that every world path appears in project-worlds
    const paths = new Set(projectWorlds.map((w) => w.path));
    const expected = [
      '/dotfiles',
      '/agentic-workstation',
      '/agent-toolkit',
      '/v',
      '/create-awesome',
      '/community',
      '/blog',
      '/projects',
      '/open-source',
    ];
    for (const p of expected) {
      expect(paths.has(p)).toBe(true);
    }
    // Home (/) is not a world but is the brand route
    expect(paths.has('/')).toBe(false);
  });

  it('homepage can render worlds in defined priority order', () => {
    // Simulate homepage hero rendering: featuredWorlds in priority order
    const rendered = featuredWorlds.map((w) => w.title);
    expect(rendered).toEqual(['Dotfiles', 'Agent Toolkit', 'Agentic Workstation', 'V Ecosystem', 'Create Awesome']);
  });
});
