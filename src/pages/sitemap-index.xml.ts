import { getCollection } from 'astro:content';
import { getCanonicalUrl, getFooterRoutes, getSiteUrl } from '@/data/routes.js';

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character] ?? character;
  });
}

function blogPath(id: string): string {
  return `/blog/${id
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;
}

export async function GET() {
  const site = getSiteUrl();
  const routes = getFooterRoutes()
    .map((route) => route.path)
    .filter((path) => !path.includes('['));

  let blogEntries: Array<{ loc: string; lastmod: string }> = [];
  try {
    const posts = await getCollection('blog');
    blogEntries = posts
      .filter((post) => !post.data.draft)
      .map((post) => ({
        loc: getCanonicalUrl(blogPath(post.id), site),
        lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      }));
  } catch {
    blogEntries = [];
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url>
    <loc>${escapeXml(getCanonicalUrl(path, site))}</loc>
  </url>`,
  )
  .concat(
    blogEntries.map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`,
    ),
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
