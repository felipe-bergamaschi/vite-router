import chokidar from 'chokidar';
import debounce from 'debounce';
import fs from 'node:fs';
import type { PluginOption } from 'vite';
import { configureDefaults } from './defaults';
import { generateRoutes } from './generator';
import type { RouterProps } from './types';

export function ViteRouter(props: Partial<RouterProps> = {}): PluginOption {
  const config = configureDefaults(props);

  const watcher = chokidar.watch(config.dir);
  const generator = debounce(generateRoutes, 100);

  // checks if dir and output exists
  if (!fs.existsSync(config.output)) {
    throw new Error('ERR: The output file does not exist');
  }

  if (!fs.existsSync(config.dir)) {
    throw new Error('ERR: The pages directory does not exist');
  }

  return {
    name: 'vite-plugin-router',

    enforce: 'pre',

    configureServer() {
      watcher.on('add', () => generator(config));
      watcher.on('unlink', () => generator(config));

      watcher.on('ready', () => {
        console.info('Vite router is ready');
        console.info(`Watching at (${config.dir})`);
      });
    },

    closeBundle() {
      return watcher.close();
    }
  };
}
