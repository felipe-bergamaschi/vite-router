import path from 'path';
import { PluginOption } from 'vite';

export interface ViteRouterPros {
  dir?: string;
  extensions?: string[];
}

const defaultDir = 'src/app';
const defaultExtensions = ['tsx', 'ts', 'jsx', 'js'];

export function viteRouter({
  dir: dirPath = defaultDir,
  extensions = defaultExtensions
}: ViteRouterPros = {}): PluginOption {
  const currentModuleDir = path.dirname(new URL(import.meta.url).pathname);

  const dir = path.resolve(currentModuleDir, dirPath);

  console.log({ dir, extensions });

  return {
    name: 'vite-plugin-router',

    configResolved(config) {
      const plugins = config.plugins.map((plugin) => plugin.name);
      console.log(`Seu projeto possui ${plugins.length} plugins do Vite.`);
      console.table(plugins);
    },
  };
}
