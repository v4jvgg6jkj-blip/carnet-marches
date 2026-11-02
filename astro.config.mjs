// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL et BASE_PATH sont fournis automatiquement par le workflow GitHub Pages.
// En local, le site tourne sur http://localhost:4321/
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
