import { getSiteUrl } from '@/data/routes.js';

export function GET() {
  const site = getSiteUrl();
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
