import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://horaclecapital.com',
  // Astro handles src/pages/ for new dynamic content.
  // Existing static HTML files are copied via GitHub Actions (see .github/workflows/deploy.yml).
  integrations: [sitemap()],
  build: {
    format: 'file',   // /rapports/mon-article.html (no trailing-slash dirs)
  },
});
