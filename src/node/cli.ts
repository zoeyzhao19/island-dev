import cac from 'cac';
import { build } from './build';

const cli = cac('island');

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const createServer = async () => {
    const { createDevServer } = await import('./dev');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  createServer();
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    await build(root);
  });

cli.help();
cli.parse();
