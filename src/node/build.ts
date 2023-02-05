import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs-extra';
import { build as viteBUild } from 'vite';
import type { InlineConfig } from 'vite';
import type { RollupOutput } from 'rollup';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';

export async function build(root: string) {
  // 1. bundle -client端 + server端
  const [clientBundle] = await bundle(root);

  // 2. 引入server-entry模块
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产品html
  const { render } = await import(pathToFileURL(serverEntryPath).href);
  console.log('pathToFileURL(serverEntryPath)', pathToFileURL(serverEntryPath));
  renderPage(render, root, clientBundle);
}

async function renderPage(
  render: () => void,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  const html = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>

  `.trim();

  await fs.writeFile(path.resolve(root, 'build', 'index.html'), html);
  await fs.remove(path.resolve(root, '.temp'));
}

async function bundle(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm',
            },
          },
        },
      };
    };

    const clientBuild = async (): Promise<RollupOutput> => {
      return viteBUild(resolveViteConfig(false)) as any;
    };
    const serverBuild = async (): Promise<RollupOutput> => {
      return viteBUild(resolveViteConfig(true)) as any;
    };

    console.log('Build client + server bundles...');
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild(),
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.error(e);
    return [];
  }
}
