import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    {
      input: './src/node/cli',
      name: 'cli',
    },
  ],
  clean: true,
  declaration: true,
  outDir: 'dist',
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
});
