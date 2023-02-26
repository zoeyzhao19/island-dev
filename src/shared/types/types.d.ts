declare module 'virtual:island:site-data' {
  import type { UserConfig } from '@shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'virtual:island:routes' {
  import { RouteObject } from 'react-router-dom';
  const routes: RouteObject[];
  export { routes };
}
