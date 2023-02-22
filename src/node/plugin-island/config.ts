import path from 'path';
import type { Plugin } from 'vite';
import { SiteConfig } from '../../shared/types';
import { slash } from '../utils';
import { PACKAGE_ROOT } from '../constants';

const virtualModuleId = 'virtual:island:site-data';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: 'island:config',
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': path.join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts'),
            '@theme-default': path.join(
              PACKAGE_ROOT,
              'src',
              'theme-default',
              'index.ts'
            ),
          },
        },
      };
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [slash(config.configPath)];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(`\nconfig file changed, restarting server...`);
        await restartServer?.();
      }
    },
    resolveId(source) {
      if (source === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          export default ${JSON.stringify(config)};
        `;
      }
    },
  };
}
