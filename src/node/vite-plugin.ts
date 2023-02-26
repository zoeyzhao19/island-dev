import pluginReact from '@vitejs/plugin-react';
import type { SiteConfig } from '@shared/types';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';

export function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    // usage ??
    pluginReact({
      jsxRuntime: 'automatic',
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
    }),
  ];
}
