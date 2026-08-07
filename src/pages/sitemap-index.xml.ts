export function GET() {
  const site = 'https://ulises-jeremias.com';
  const routes = [
    '/',
    '/dotfiles',
    '/agentic-workstation',
    '/agent-toolkit',
    '/v',
    '/create-awesome',
    '/community',
    '/blog',
    '/projects',
    '/open-source',
  ];
  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${site}${r}</loc><lastmod>${now}</lastmod></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
