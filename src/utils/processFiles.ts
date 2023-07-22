import { formatFileName, formatPath } from './';
import { File, ProcessedRoute, IProcessFiles } from '../types';
import { ROOT_DIR } from '../constants';

export function processFiles(files: File[]): IProcessFiles {
  const processedFiles: ProcessedRoute[] = [];
  const layoutFiles: File[] = [];

  files.forEach(({ name, path }) => {
    if (name.includes('style') || name.includes('css')) return;

    if (name.includes('layout')) {
      layoutFiles.push({ name, path });
      return;
    }

    // TODO: verificar se o nome do arquivo e do diretório seguem o padrão
    const processedPath = formatPath(path);
    const fileName = formatFileName(name);

    if (processedPath === ROOT_DIR) {
      processedFiles.push({
        path,
        name,
        route: fileName
      });

      return;
    }

    processedFiles.push({
      path,
      name,
      route: `${processedPath}${fileName}`
    });
  });

  return {
    files: processedFiles,
    layouts: layoutFiles
  };
}
