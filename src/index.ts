import path from 'path';
import chokidar from 'chokidar';

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

  return {
    name: 'vite-plugin-router',

    configureServer() {
      chokidarWatcher.on('add', () => {
        generateRoutes({ dir: dirPath, outDir });
      });

      chokidarWatcher.on('unlink', () => {
        generateRoutes({ dir: dirPath, outDir });
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
