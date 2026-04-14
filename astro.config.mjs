// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://admilogistic.es',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/admin'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // Homepage y herramientas: máxima prioridad
        if (item.url === 'https://admilogistic.es/') {
          return { ...item, changefreq: 'daily', priority: 1.0 };
        }
        if (item.url.includes('/proyectos')) {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        }
        if (item.url.includes('/blog/')) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        if (item.url.includes('/categorias/') || item.url.includes('/bases-datos/')) {
          return { ...item, changefreq: 'weekly', priority: 0.75 };
        }
        return { ...item, changefreq: 'monthly', priority: 0.6 };
      },
    }),
  ],
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
