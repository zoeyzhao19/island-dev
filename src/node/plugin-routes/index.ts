import type { Plugin } from 'vite';
import { RouteService } from './RouteService';

export const CONVENTIONAL_ROUTE_ID = 'virtual:island:routes';

interface PluginOptions {
  root: string;
}

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);
  return {
    name: 'island:routes',
    async configResolved() {
      await routeService.init();
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + CONVENTIONAL_ROUTE_ID;
      }
    },
    load(id) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRouteCode();
      }
    },
  };
}
