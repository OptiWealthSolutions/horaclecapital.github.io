import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://horaclecapital.com/',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    // sitemap(),
    tailwind()
  ],
  build: {
    format: 'file',   // /rapports/mon-article.html (no trailing-slash dirs)
  },
});
