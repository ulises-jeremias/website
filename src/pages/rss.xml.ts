import { getCollection } from 'astro:content';
export async function GET() {
  const blog = await getCollection('blog');
  const items = blog
    .filter((p) => !p.data.draft)
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>https://ulises-jeremias.com/blog/${post.slug}/</link>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
    </item>`,
    )
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ulises Jeremias — Blog</title><description>Field notes</description><link>https://ulises-jeremias.com/blog</link>${items}</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
