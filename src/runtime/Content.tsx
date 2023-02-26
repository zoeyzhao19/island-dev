import { useRoutes } from 'react-router-dom';
import { routes } from 'virtual:island:routes';

export const Content = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};
