import { describe, expect, it } from 'vitest';
import {
  getContactLinks,
  getCurrentlyBuilding,
  getFeaturedWorlds,
  getOpenSourceProofs,
  getStrengths,
} from '@/features/home/services/home';

describe('home services', () => {
  it('returns currently building items', () => {
    const items = getCurrentlyBuilding();
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items[0].title).toBeDefined();
  });

  it('returns featured worlds (project universe)', () => {
    const worlds = getFeaturedWorlds();
    expect(worlds.length).toBe(6);
    expect(worlds.map((w) => w.title)).toContain('V Language');
  });

  it('returns strengths without skill bars (systems)', () => {
    const s = getStrengths();
    expect(s.length).toBe(4);
    // No numeric skill bar values
    for (const item of s) {
      expect(item.points.length).toBeGreaterThan(0);
      // Ensure no percentage-like content
      expect(JSON.stringify(item)).not.toMatch(/\d+%/);
    }
  });

  it('returns open-source proof with evidence links', () => {
    const proofs = getOpenSourceProofs();
    expect(proofs.length).toBe(3);
    for (const p of proofs) {
      expect(p.links.length).toBeGreaterThan(0);
      expect(p.links[0].href).toMatch(/^https:\/\//);
    }
  });

  it('returns contact links with verified GH/LinkedIn/email/Discord', () => {
    const links = getContactLinks();
    const labels = links.map((l) => l.label);
    expect(labels).toContain('GitHub');
    expect(labels).toContain('LinkedIn');
    expect(labels).toContain('Email');
    expect(labels).toContain('Discord');
  });
});
