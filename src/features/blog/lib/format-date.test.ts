import { describe, expect, it } from 'vitest';
import { formatBlogDate } from './format-date';

describe('formatBlogDate', () => {
  it('keeps ISO calendar dates stable across host timezones', () => {
    expect(formatBlogDate(new Date('2026-10-05'))).toBe('October 5, 2026');
    expect(formatBlogDate(new Date('2026-10-05'), 'short')).toBe('Oct 5, 2026');
  });
});
