import fs from 'fs/promises';
import type { Plugin } from 'vite';
import { DEFAULT_TEMPLATE_PATH, CLIENT_ENTRY_PATH } from '../constants';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // custom handle request...
          let html = await fs.readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');
          html = await server.transformIndexHtml(
            req.url!,
            html,
            req.originalUrl
          );
          res.setHeader('Content-Type', 'text/html');
          res.end(html);
        });
      };
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: 'body',
          },
        ],
      };
    },
  };
}
