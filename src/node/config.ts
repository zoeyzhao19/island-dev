import path from 'path';
import fs from 'fs';
import { loadConfigFromFile } from 'vite';
import type { UserConfig, SiteConfig } from '@shared/types';

type RawConfig = UserConfig | Promise<UserConfig> | (() => UserConfig);

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    const configPath = supportConfigFiles
      .map((file) => path.resolve(root, file))
      .find((file) => fs.existsSync(file));
    return configPath;
  } catch (e) {
    console.log(`Failed to load config file`);
    throw e;
  }
}

async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 1, 获取配置文件路径，支持js ts格式
  const configPath = getUserConfigPath(root)!;
  const result = await loadConfigFromFile(
    {
      command,
      mode,
    },
    configPath,
    root
  );
  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = (await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig)) as UserConfig;
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Island.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {},
  };
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  const siteConfig: SiteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig),
  };
  return siteConfig;
}

export function defineConfig(config: UserConfig) {
  return config;
}
