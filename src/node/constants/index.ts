import path from 'path';

const cwd = process.cwd();
export const DEFAULT_TEMPLATE_PATH = path.join(cwd, 'template.html');
export const CLIENT_ENTRY_PATH = path.join(
  cwd,
  'src',
  'runtime',
  'client-entry.tsx'
);
