import { createServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { pluginIndexHtml, pluginConfig } from './plugin-island';
import { resolveConfig } from './config';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer),
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
