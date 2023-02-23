import path from 'path';
import fs from 'fs';

export function slash(id: string) {
  return id.replace(/\\/g, '/');
}

export function lookupFile(
  dir: string,
  formats: string[],
  options?: { pathOnly: boolean }
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const result = options?.pathOnly
        ? fullPath
        : fs.readFileSync(fullPath, 'utf-8');
      return result;
    }
  }

  const parentDir = path.dirname(dir);
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, options);
  }
}
