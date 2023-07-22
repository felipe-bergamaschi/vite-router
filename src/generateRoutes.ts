import type { IViteRouterPros } from "./types";
import { findLayout } from "./utils/findLayout";
import { getFilesWithExtensions } from "./utils/getFilesWithExtensions";
import { Log } from "./utils/log";
import { processFiles } from "./utils/processFiles";

export function generateRoutes({ dir = '', outDir = '' }: IViteRouterPros) {
  const getFiles = getFilesWithExtensions(dir);

  const { files, layouts } = processFiles(getFiles);

  const routes = findLayout(files, layouts);

  console.log({ routes })

  // Log.info(getFiles)
  // Log.info(`outDir: ${outDir}`)
}