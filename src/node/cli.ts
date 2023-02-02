import cac from 'cac';

const cli = cac('island');

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  console.log('dev', root);
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    console.log('build', root);
  });

cli.help();
cli.parse();
