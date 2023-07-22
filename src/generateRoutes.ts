import type { IViteRouterPros } from "./types";
import { getFilesWithExtensions } from "./utils/getFilesWithExtensions";
import { Log } from "./utils/log";
import { processFiles } from "./utils/processFiles";

export function generateRoutes({ dir = '', outDir = '' }: IViteRouterPros) {
  const getFiles = getFilesWithExtensions(dir);

  const { files, layouts } = processFiles(getFiles);

  console.log({ files, layouts })

  // Log.info(getFiles)
  // Log.info(`outDir: ${outDir}`)
}