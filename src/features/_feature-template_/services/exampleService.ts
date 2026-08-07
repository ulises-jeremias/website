import type { ExampleServiceResult } from '../types/index.js';

export function getExamples(): ExampleServiceResult[] {
  return [
    {
      id: 'static-html',
      title: 'Static HTML output',
      description: 'Pages ship as pre-rendered HTML. No client JavaScript is included unless you add islands.',
    },
    {
      id: 'content-collections',
      title: 'Content collections',
      description: 'A sample blog collection under src/content/blog with list and detail routes at /blog.',
    },
    {
      id: 'layouts-seo',
      title: 'Layouts & SEO head',
      description: 'BaseLayout and BaseHead provide shared title and meta description across pages.',
    },
  ];
}

export function getExampleById(id: string): ExampleServiceResult | undefined {
  return getExamples().find((example) => example.id === id);
}
