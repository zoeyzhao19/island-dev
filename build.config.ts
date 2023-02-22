import fs from 'fs';
import path from 'path';
import { defineBuildConfig } from 'unbuild';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

const projectRootDir = path.resolve(__dirname);

export default defineBuildConfig({
  entries: [
    {
      input: './src/node/cli',
    },
    {
      input: './src/index',
    },
    {
      input: './src/node/dev',
    },
  ],
  clean: true,
  declaration: true,
  outDir: 'dist',
  alias: {
    '@shared/types': path.resolve(projectRootDir, 'src/shared/types'),
  },
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  hooks: {
    'rollup:done'() {
      if (process.env.DEV) {
        const extensions = ['.cjs', '.mjs'];
        for (const ext of extensions) {
          const mjsPath = path.resolve(__dirname, 'dist', `cli${ext}`);
          let content = fs.readFileSync(mjsPath, 'utf-8');
          const JTIT_RE = /(interopDefault: true, esmResolve: true)/;
          const matches = content.match(JTIT_RE);
          if (matches && matches[0] && matches[1]) {
            if (ext === 'mjs') {
              content = `import dynamicImport from '@babel/plugin-proposal-dynamic-import';\n${content}`;
            }
            const replaceStr =
              ext === 'mjs'
                ? 'transformOptions: { babel: { plugins: [dynamicImport] }}'
                : "transformOptions: {babel: { plugins: [require('@babel/plugin-proposal-dynamic-import')] }}";
            content = content.replace(
              matches[1],
              `${matches[1]}, ${replaceStr},`
            );
            content = prettier.format(content, {
              parser: 'babel',
              plugins: [parserBabel],
              tabWidth: 2,
              useTabs: false,
              semi: true,
              singleQuote: true,
              endOfLine: 'auto',
            });
            fs.writeFileSync(mjsPath, content);
          }
        }
      }
    },
  },
});
