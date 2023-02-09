import path from 'path';

export const PACKAGE_ROOT = process.cwd();
export const DEFAULT_TEMPLATE_PATH = path.join(PACKAGE_ROOT, './template.html');
export const CLIENT_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
);
export const SERVER_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx'
);
