import type { ViteRouterPros } from ".";
import { Log } from "./utils/log";

export function generateRoutes({ dir, extensions }: ViteRouterPros) {
  Log.info('Routes generated')
  Log.info(`dir: ${dir}`)
  Log.info(`extensions: ${extensions}`)
}