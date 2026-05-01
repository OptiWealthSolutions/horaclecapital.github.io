import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://horaclecapital.com',
  // Astro handles src/pages/ for new dynamic content.
  // Static HTML files are copied via GitHub Actions (see .github/workflows/deploy.yml).
  // Sitemap is managed as a static sitemap.xml copied in CI.
  build: {
    format: 'file',   // /rapports/mon-article.html (no trailing-slash dirs)
  },
});
