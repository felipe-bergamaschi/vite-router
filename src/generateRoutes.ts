import path from "path";
import fs from "fs";
import prettier from 'prettier';

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

  const fileName = 'router.tsx';
  const filePath = path.join(CURRENT_DIR, outDir, fileName);

  prettier.format(generateTemplate, {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    jsxBracketSameLine: false,
  }).then((result) => {

    fs.writeFileSync(filePath, result, 'utf-8');
    Log.info(`Generated successfully`);
  }).catch((error) => {
    Log.error(`Generate template error: ${error}`);
  });
}