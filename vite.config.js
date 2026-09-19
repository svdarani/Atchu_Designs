import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { handleApiRequest } from './server/api.js';

const apiPlugin = () => ({
  name: 'atchu-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/api/')) {
        handleApiRequest(req, res).catch(err => {
          console.error('API Middleware Exception:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Server error: ' + err.message }));
        });
      } else {
        next();
      }
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/api/')) {
        handleApiRequest(req, res).catch(err => {
          console.error('API Preview Exception:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Server error: ' + err.message }));
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), apiPlugin()],
});
