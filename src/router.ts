import chokidar from 'chokidar';
import debounce from 'debounce';
import type { PluginOption } from 'vite';
import { configureDefaults } from './defaults';
import { generateRoutes } from './generator';
import type { RouterProps } from './types';

export function ViteRouter(props: Partial<RouterProps> = {}): PluginOption {
  const config = configureDefaults(props);

  const watcher = chokidar.watch(config.dir);
  const generator = debounce(generateRoutes, 100);

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
