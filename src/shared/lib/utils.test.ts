import { describe, expect, it } from 'vitest';
import { cn, formatDate, slugify } from '@/shared/lib/utils';

describe('utils', () => {
  it('cn joins classes', () => {
    expect(cn('a', 'b', undefined, false, 'c')).toBe('a b c');
  });

  it('slugify creates slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('  Astro & Islands! ')).toBe('astro-islands');
  });

  it('formatDate formats correctly', () => {
    const date = new Date('2024-01-15T00:00:00Z');
    expect(formatDate(date, 'en-US')).toContain('2024');
  });
});
