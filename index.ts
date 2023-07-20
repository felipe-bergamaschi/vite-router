import path from 'path';
import { PluginOption } from 'vite';

interface ViteRouterPros {
  dir?: string;
  extensions?: string[];
};

const defaultDir = 'src/app';
const defaultExtensions = ['tsx', 'ts', 'jsx', 'js'];

export function viteRouter({
  dir: dirPath = defaultDir,
  extensions = defaultExtensions
}: ViteRouterPros = {}): PluginOption {
  const dir = path.resolve(__dirname, dirPath);

  console.log({ dir, extensions });

  return {
    name: 'vite-plugin-router',

    configResolved(config) {
      const plugins = config.plugins.map((plugin) => plugin.name);
      console.log(`Your project has ${plugins.length} Vite plugins.`);
      console.table(plugins);
    },
  }
}
