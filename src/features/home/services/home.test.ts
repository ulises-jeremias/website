import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';
import { projectWorlds } from '@/data/project-worlds';
import * as homeData from '@/features/home/data';

type AtlasWorld = {
  id: string;
  path: string;
  number: string;
  illustration: string;
  accent: string;
  relatedWorlds: string[];
};

type NestStatusItem = {
  label: string;
  value: string;
};

const atlasWorlds = (homeData as unknown as { atlasWorlds?: AtlasWorld[] }).atlasWorlds;
const nestStatus = (homeData as unknown as { nestStatus?: NestStatusItem[] }).nestStatus;
const featuredProjectLedger = (
  homeData as unknown as {
    featuredProjectLedger?: Array<{ id: string; path: string; title: string; description: string }>;
  }
).featuredProjectLedger;
const contactLinks = (
  homeData as unknown as {
    contactLinks?: Array<{ label: string; href: string; illustration: string }>;
  }
).contactLinks;

describe('homepage canonical data', () => {
  it('projects all nine canonical worlds into a numbered atlas', () => {
    expect(atlasWorlds).toBeTypeOf('object');
    if (!atlasWorlds) return;

    expect(atlasWorlds).toHaveLength(9);
    expect(atlasWorlds.map((world) => world.id)).toEqual(projectWorlds.map((world) => world.id));
    expect(atlasWorlds.map((world) => world.number)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09']);
    expect(new Set(atlasWorlds.map((world) => world.path)).size).toBe(9);
  });

  it('uses qualitative or derived status instead of generated telemetry', () => {
    expect(nestStatus).toBeTypeOf('object');
    if (!nestStatus) return;

    expect(nestStatus.length).toBeGreaterThanOrEqual(3);
    expect(nestStatus.some((item) => item.value.includes(String(projectWorlds.length)))).toBe(true);
    expect(JSON.stringify(nestStatus)).not.toMatch(/commits|stars|downloads|coffee|years.hacking/i);
  });

  it('derives featured project rows from canonical worlds', () => {
    expect(featuredProjectLedger).toBeTypeOf('object');
    if (!featuredProjectLedger) return;

    expect(featuredProjectLedger.map((item) => item.id)).toEqual(
      projectWorlds.filter((world) => world.featured).map((world) => world.id),
    );
    expect(featuredProjectLedger.every((item) => item.path.startsWith('/'))).toBe(true);
  });

  it('derives contact links from the verified profile', () => {
    expect(contactLinks).toBeTypeOf('object');
    if (!contactLinks) return;

    expect(contactLinks.map((item) => item.href)).toEqual([
      profile.links.github,
      profile.links.linkedin,
      `mailto:${profile.links.email}`,
      profile.links.discord,
    ]);
  });

  it('contains no emoji icons, fake metrics, or leaked issue identifiers', () => {
    const serialized = JSON.stringify(homeData);

    expect(serialized).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(serialized).not.toMatch(/\b(?:52 skills|20\+ public repos|commits|stars|downloads)\b/i);
    expect(serialized).not.toMatch(/\b(?:Epic\s+[A-Z]|[A-Z]-\d{2,})\b/);
  });
});
