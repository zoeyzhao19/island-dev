import path from 'path';
import fastGlob from 'fast-glob';
import { normalizePath } from 'vite';
import React from 'react';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  private scanDir: string;
  private routeData: RouteMeta[] = [];

  constructor(scanDir: string) {
    this.scanDir = normalizePath(scanDir);
  }

  async init() {
    const scanFilePath = fastGlob.sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
      cwd: this.scanDir,
      absolute: true,
      ignore: ['**/build/**', '**/.island/**', 'config.ts'],
    });
    scanFilePath.forEach((filePath) => {
      const relativePath = normalizePath(path.relative(this.scanDir, filePath));
      const routePath = this.normalizeRoutePath(relativePath);
      this.routeData.push({
        routePath: routePath.startsWith('/') ? routePath : `/${routePath}`,
        absolutePath: filePath,
      });
    });
  }

  getScanDir() {
    return this.scanDir;
  }

  getRouteMeta() {
    return this.routeData;
  }

  normalizeRoutePath(rawPath: string) {
    return rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
  }

  generateRouteCode() {
    return `
import React from 'react'
import loadable from '@loadable/component'
${this.routeData
  .map((route, index) => {
    return `const Route${index} = loadable(() => import('${route.absolutePath}'))`;
  })
  .join('\n')}
export const routes = [
  ${this.routeData.map((route, index) => {
    return `{
    path: '${route.routePath}',
    element: React.createElement(Route${index})
  }
  `;
  })}]
`;
  }
}
