import fs from 'fs';
import path from 'path';

import { extensions, ROOT_DIR } from '../constants';

export function getFilesWithExtensions(dir: string) {
  const files: any = [];

  function traverseDirectory(dir: string, currentPath = '') {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();

      if (isDirectory) {
        const newPath = path.join(currentPath, item).replace(/\\/g, '/');

        traverseDirectory(itemPath, newPath);
        return;
      }

      const fileExtension = path.extname(item);

      if (extensions.includes(fileExtension)) {
        const filePath = currentPath === '' ? ROOT_DIR : `${ROOT_DIR}${currentPath}`;

        files.push({ path: filePath, file: item });
      }
    });

    return files;
  }

  traverseDirectory(dir);

  return files;
}
