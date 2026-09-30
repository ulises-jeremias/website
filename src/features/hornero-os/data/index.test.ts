import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { horneroComponents, horneroFacts, manifestSlots } from './index';

const page = readFileSync(resolve(process.cwd(), 'src/features/hornero-os/components/HorneroOsPage.astro'), 'utf8');

describe('Hornero OS facts (ADR-004 maturity rule)', () => {
  it('keeps installer and iso as future manifest slots', () => {
    const future = manifestSlots.filter((slot) => slot.status === 'future').map((slot) => slot.id);
    expect(future).toEqual(['installer', 'iso']);
  });

  it('never offers an ISO download or installer command', () => {
    const serialized = JSON.stringify({ horneroComponents, manifestSlots, horneroFacts });
    expect(serialized).not.toMatch(/\.iso\b|download the iso|archinstall .*hornero|install hornero os/i);
    const installer = horneroComponents.find((component) => component.id === 'installer')!;
    expect(installer.state).toBe('not-yet');
    expect(installer.tryIt).toBeUndefined();
  });

  it('labels the AI-native direction as direction only', () => {
    expect(horneroComponents.find((component) => component.id === 'assistant')!.state).toBe('direction');
  });

  it('states the preview status in the hero and credits the brand imagery', () => {
    expect(page).toContain('not installable yet');
    expect(page).toContain('Brand wallpaper, not a screenshot');
    expect(page).toContain('FlagshipProvenance entryId="hornero-os"');
  });
});
