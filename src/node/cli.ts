import cac from 'cac';
import { createDevServer } from './dev';
import { build } from './build';

const cli = cac('island');

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    await build(root);
  });

cli.help();
cli.parse();
