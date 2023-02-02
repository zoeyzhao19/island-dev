import { createServer } from 'vite';

export function createDevServer(root: string) {
  return createServer({
    root,
    server: {
      port: 3000,
    },
  });
}
