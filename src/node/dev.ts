import { createServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { pluginIndexHtml } from './plugin-island/indexHtml';

export function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
