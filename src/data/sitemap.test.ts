import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getCollection: vi.fn() }));

vi.mock('astro:content', () => ({ getCollection: mocks.getCollection }));

import { GET } from '../pages/sitemap-index.xml.js';

describe('sitemap', () => {
  beforeEach(() => {
    mocks.getCollection.mockReset();
  });

  it('uses content dates for published posts and no build-clock dates for static routes', async () => {
    mocks.getCollection.mockResolvedValue([
      {
        id: 'published-note',
        data: {
          draft: false,
          pubDate: new Date('2025-02-01T00:00:00.000Z'),
          updatedDate: new Date('2025-02-04T00:00:00.000Z'),
        },
      },
      {
        id: 'draft-note',
        data: { draft: true, pubDate: new Date('2025-03-01T00:00:00.000Z') },
      },
    ]);

    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<loc>https://www.ulises-jeremias.dev/projects</loc>');
    expect(body).not.toMatch(/<loc>https:\/\/www\.ulises-jeremias\.dev\/projects<\/loc>\s*<lastmod>/);
    expect(body).toContain('<loc>https://www.ulises-jeremias.dev/blog/published-note</loc>');
    expect(body).toContain('<lastmod>2025-02-04T00:00:00.000Z</lastmod>');
    expect(body).not.toContain('draft-note');
  });

  it('keeps a valid static sitemap when the collection is unavailable', async () => {
    mocks.getCollection.mockRejectedValue(new Error('collection unavailable'));

    const response = await GET();
    const body = await response.text();

    expect(response.headers.get('content-type')).toContain('application/xml');
    expect(body).toContain('<urlset');
    expect(body).toContain('<loc>https://www.ulises-jeremias.dev/</loc>');
  });
});
