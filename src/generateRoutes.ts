import type { IViteRouterPros } from "./types";
import { getFilesWithExtensions } from "./utils/getFilesWithExtensions";
import { Log } from "./utils/log";

export function generateRoutes({ dir = '', outDir = '' }: IViteRouterPros) {
  const getFiles = getFilesWithExtensions(dir);

  Log.info(getFiles)
  Log.info(`outDir: ${outDir}`)
}