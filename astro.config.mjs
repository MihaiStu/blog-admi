// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://admilogistic.es',
  integrations: [sitemap()],
  vite: {
    plugins: [
      {
        name: 'admin-index-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/admin' || req.url === '/admin?') {
              req.url = '/admin/index.html';
            } else if (req.url?.startsWith('/admin?')) {
              req.url = '/admin/index.html' + req.url.slice(6);
            }
            next();
          });
        },
      },
    ],
  },
});
