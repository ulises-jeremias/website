/**
 * O-18 — Content schema tests
 *
 * Verifies the blog collection Zod schema accepts valid entries and rejects
 * invalid ones.  The blog collection is empty at site launch, so these tests
 * guard the schema definition itself — if the schema changes, tests must
 * update explicitly.
 */
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';

// Mirror of the schema defined in src/content.config.ts so it can be tested
// in isolation without an Astro build context.
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  ogImage: z.string().startsWith('/').optional(),
  ogImageAlt: z.string().min(1).optional(),
  draft: z.boolean().default(false),
});

const validEntry = {
  title: 'My first post',
  description: 'A short description of the post.',
  pubDate: '2026-01-01',
};

describe('blog collection schema', () => {
  it('accepts a minimal valid entry', () => {
    const result = blogSchema.safeParse(validEntry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.draft).toBe(false);
      expect(result.data.pubDate).toBeInstanceOf(Date);
    }
  });

  it('accepts a full entry with all optional fields', () => {
    const result = blogSchema.safeParse({
      ...validEntry,
      updatedDate: '2026-02-01',
      ogImage: '/assets/blog/my-post.png',
      ogImageAlt: 'A screenshot of the project',
      draft: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.draft).toBe(true);
      expect(result.data.ogImage).toBe('/assets/blog/my-post.png');
    }
  });

  it('rejects an entry missing title', () => {
    const { title: _, ...rest } = validEntry;
    expect(blogSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an entry missing description', () => {
    const { description: _, ...rest } = validEntry;
    expect(blogSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an entry missing pubDate', () => {
    const { pubDate: _, ...rest } = validEntry;
    expect(blogSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an ogImage that does not start with /', () => {
    const result = blogSchema.safeParse({
      ...validEntry,
      ogImage: 'https://example.com/image.png',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty ogImageAlt', () => {
    const result = blogSchema.safeParse({
      ...validEntry,
      ogImage: '/assets/img.png',
      ogImageAlt: '',
    });
    expect(result.success).toBe(false);
  });

  it('coerces pubDate string to a Date object', () => {
    const result = blogSchema.safeParse({ ...validEntry, pubDate: '2026-06-15' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pubDate).toBeInstanceOf(Date);
      expect(result.data.pubDate.getUTCFullYear()).toBe(2026);
    }
  });

  it('coerces updatedDate string to a Date object when provided', () => {
    const result = blogSchema.safeParse({ ...validEntry, updatedDate: '2026-07-01' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.updatedDate).toBeInstanceOf(Date);
    }
  });
});
