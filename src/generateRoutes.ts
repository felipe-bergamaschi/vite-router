import fs from 'fs';
import path from 'path';

import { CURRENT_DIR } from './constants';
import { template } from './template';
import type { IViteRouterPros } from './types';
import { findLayout } from './utils/findLayout';
import { getFilesWithExtensions } from './utils/getFilesWithExtensions';
import { Log } from './utils/log';
import { processFiles } from './utils/processFiles';

export function generateRoutes({ dir = '', outDir = '' }: IViteRouterPros) {
  const getFiles = getFilesWithExtensions(dir);

  const { files, layouts } = processFiles(getFiles);

  const routes = findLayout(files, layouts);

  const generateTemplate = template(routes, layouts);

  const fileName = 'routes.tsx';
  const filePath = path.join(CURRENT_DIR, outDir, fileName);

  fs.writeFileSync(filePath, generateTemplate, 'utf-8');
  Log.info(`Generated successfully`);
}
