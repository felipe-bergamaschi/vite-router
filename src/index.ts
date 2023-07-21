import path from 'path';
import chokidar from 'chokidar';
import lodash from 'lodash';

import { CURRENT_DIR, DEFAULT_DIR, DEFAULT_OUT_DIR } from './constants'
import { generateRoutes } from './generateRoutes'
import { Log } from './utils/log'
import type { IViteRouterPlugin, IViteRouterPros } from './types';

export default function viteRouter({
  dir = DEFAULT_DIR,
  outDir = DEFAULT_OUT_DIR
}: IViteRouterPros = {}): IViteRouterPlugin {
  const dirPath = path.resolve(CURRENT_DIR, dir);
  const chokidarWatcher = chokidar.watch(dirPath);

  const debounceGenerateRoutes = lodash.debounce(generateRoutes, 100);

  return {
    name: 'vite-plugin-router',

    configureServer() {
      chokidarWatcher.on('add', () => {
        debounceGenerateRoutes({ dir: dirPath, outDir });
      });

      chokidarWatcher.on('unlink', () => {
        debounceGenerateRoutes({ dir: dirPath, outDir });
      });

      chokidarWatcher.on('ready', () => {
        Log.info('Vite router is ready');
        Log.info(`Observing in: ${dirPath}`);
      });
    },
    closeBundle() {
      chokidarWatcher.close();
    }
  };
}
