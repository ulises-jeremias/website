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
    expect(labels).toContain('Core Team Member');
    expect(labels).toContain('AUR Maintainer');
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

  it('profile.yaml mirror exists and is parseable', async () => {
    const fs = await import('node:fs');
    const path = 'src/content/profile.yaml';
    expect(fs.existsSync(path)).toBe(true);
    const content = fs.readFileSync(path, 'utf8');
    expect(content).toContain('Ulises Jeremias');
    expect(content).toContain('https://github.com/ulises-jeremias');
  });
});
