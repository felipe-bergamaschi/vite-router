import path from "path";
import fs from "fs";
import { minify } from "terser";
import babel from "@babel/core";

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

  babel.transform(generateTemplate, {
    filename: 'router.tsx',
    presets: ['@babel/preset-react', '@babel/preset-typescript']
  }, (err, result) => {
    if (err) {
      Log.error('Generate template error:', err);

      return;
    }

    minify(result?.code || '')
      .then((minifiedResult) => {
        const fileName = 'router.jsx';
        const filePath = path.join(CURRENT_DIR, outDir, fileName);
        const result = minifiedResult.code || '';

        fs.writeFileSync(filePath, result, 'utf-8');
        Log.info(`Generated successfully`);
      })
      .catch((error) => {
        Log.error('Generate template error:', error);
      });
  });

}