import { getFooterRoutes, getSiteUrl } from '@/data/routes.js';

export function GET() {
  const site = getSiteUrl();
  const routes = getFooterRoutes()
    .map((route) => route.path)
    .filter((path) => !path.includes('['));

  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url>
    <loc>${site}${path === '/' ? '/' : path}</loc>
    <lastmod>${now}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
