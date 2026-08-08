import { defineConfig } from 'astro/config';
import { siteUrlGuard } from './src/integrations/site-url-guard.mjs';

export default defineConfig({
  site: 'https://www.ulises-jeremias.dev',
  output: 'static',
  integrations: [siteUrlGuard()],
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
