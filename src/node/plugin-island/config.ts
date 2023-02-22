import type { Plugin } from 'vite';
import { SiteConfig } from '../../shared/types';
import { slash } from '../utils';

const virtualModuleId = 'virtual:island:site-data';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export function pluginConfig(
  config: SiteConfig,
  restartServer: () => Promise<void>
): Plugin {
  return {
    name: 'island:config',
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [slash(config.configPath)];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(`\nconfig file changed, restarting server...`);
        await restartServer();
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
