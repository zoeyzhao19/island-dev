import type { Plugin } from 'vite';
import { SiteConfig } from '../../shared/types';

const virtualModuleId = 'virtual:island:site-data';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export function pluginConfig(config: SiteConfig): Plugin {
  return {
    name: 'island:config',
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
