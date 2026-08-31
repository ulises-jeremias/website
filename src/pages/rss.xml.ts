import { getCollection } from 'astro:content';
import { getSiteUrl } from '@/data/routes.js';

export async function GET() {
  const site = getSiteUrl();
  let items = '';

  try {
    const blog = await getCollection('blog');
    items = blog
      .filter((p) => !p.data.draft)
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${site}/blog/${post.id}/</link>
      <guid isPermaLink="true">${site}/blog/${post.id}/</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
    </item>`,
      )
      .join('');
  } catch {
    // Empty blog collection is valid — emit a well-formed channel with zero items.
    items = '';
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ulises Jeremias — Writing</title>
    <description>Field notes on developer tooling, agent workflows, and open source</description>
    <link>${site}/blog</link>
    <language>en-us</language>${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
