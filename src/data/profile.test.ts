import { describe, expect, it } from 'vitest';
import { getProfile, getProfileLinks, profile, profileSchema, validateProfile } from '@/data/profile';

describe('profile', () => {
  it('parses and validates profile with Zod', () => {
    expect(profile.name).toBe('Ulises Jeremias');
    expect(profileSchema.safeParse(profile).success).toBe(true);
  });

  it('has required verified roles', () => {
    const labels = profile.roles.map((r) => r.label);
    expect(labels).toContain('Solutions Architect');
    expect(labels).toContain('V Ecosystem Maintainer');
    expect(labels).toContain('AUR Maintainer');
    // ADR-004: no unverifiable "Core Team" title (no public roster exists).
    expect(labels.join(' ')).not.toMatch(/core team/i);
    expect(profile.bio).not.toMatch(/core team/i);
  });

  it('exposes the canonical GitHub Sponsors link', () => {
    expect(profile.links.sponsors).toBe('https://github.com/sponsors/ulises-jeremias');
  });

  it('has verified links (GH, LinkedIn, email, Discord)', () => {
    expect(profile.links.github).toBe('https://github.com/ulises-jeremias');
    expect(profile.links.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
    expect(profile.links.email).toContain('@');
    expect(profile.links.discord).toMatch(/^https:\/\/discord\.gg\//);
  });

  it('validateProfile throws on invalid data', () => {
    expect(() => validateProfile({ name: '' })).toThrow();
  });

  it('getProfile returns consistent object', () => {
    expect(getProfile().name).toBe(profile.name);
    expect(getProfileLinks().github).toBe(profile.links.github);
  });
});
