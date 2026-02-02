// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
