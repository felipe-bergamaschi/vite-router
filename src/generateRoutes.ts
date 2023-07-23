import path from "path";
import fs from "fs";

import type { IViteRouterPros } from "./types";
import { findLayout } from "./utils/findLayout";
import { getFilesWithExtensions } from "./utils/getFilesWithExtensions";
import { processFiles } from "./utils/processFiles";
import { template } from "./template";
import { Log } from "./utils/log";
import { CURRENT_DIR } from "./constants";

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