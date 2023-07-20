import chokidar from 'chokidar';
import { debounce } from 'lodash';
import path from 'path';
import { Plugin } from 'vite';

import { Log } from './components/log';
// import { generateRoutes } from './generateRoutes';

const srcPath = path.resolve(__dirname, '../src/app');
const extensions = ['.ts', '.tsx'];

interface ViteMagicRouterOptions {
  srcPath: string;
  extensions: string[];
}

export function viteMagicRouter(): Plugin {
  const generateRoutes = ({ extensions, srcPath }: ViteMagicRouterOptions) => {
    Log.info(`Generating routes in: ${srcPath} ${extensions}`);
  }

  const debounceGenerateRoutes = debounce(generateRoutes, 500);
  const chokidarWatcher = chokidar.watch(srcPath);

  return {
    configureServer() {
      chokidarWatcher.on('add', () => {
        debounceGenerateRoutes({ srcPath, extensions });
      });

      chokidarWatcher.on('unlink', () => {
        debounceGenerateRoutes({ srcPath, extensions });
      });

      chokidarWatcher.on('ready', () => {
        Log.info('Vite router is ready');
        Log.info(`Observing in: ${srcPath}`);
      });
    },
  };
}
