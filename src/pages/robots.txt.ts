export function GET() {
  const site = 'https://ulises-jeremias.com';
  const body = `User-agent: *
Allow: /
Sitemap: ${site}/sitemap-index.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
