import { getCollection } from 'astro:content';
import type { BlogPost } from '../types/index.js';

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts
    .map((post) => ({
      slug: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      updatedDate: post.data.updatedDate,
      draft: post.data.draft,
    }))
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export async function getPostBySlug(slug: string) {
  const posts = await getCollection('blog');
  return posts.find((post) => post.id === slug);
}
