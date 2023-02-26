import { createServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vite-plugin';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    plugins: createVitePlugins(config, restartServer),
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
