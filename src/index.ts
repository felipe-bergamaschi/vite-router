import path from 'path';
import chokidar from 'chokidar';
import { PluginOption } from 'vite';

import { generateRoutes } from './generateRoutes'
import { Log } from './utils/log'

export interface ViteRouterPros {
  dir?: string;
  extensions?: string[];
}

const defaultDir = 'src/app';
const defaultExtensions = ['tsx', 'ts', 'jsx', 'js'];
const currentDirectory = process.cwd();

export default function viteRouter({
  dir = defaultDir,
  extensions = defaultExtensions
}: ViteRouterPros = {}): PluginOption {
  const dirPath = path.resolve(currentDirectory, dir);
  const chokidarWatcher = chokidar.watch(dirPath);

  return {
    name: 'vite-plugin-router',

    configureServer() {
      chokidarWatcher.on('add', () => {
        generateRoutes({ dir: dirPath, extensions });
      });

      chokidarWatcher.on('unlink', () => {
        generateRoutes({ dir: dirPath, extensions });
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
