import { ROOT_DIR } from '../constants';

export function formatPath(path: string): string {
  return path.replace(/\[(.+?)\]/g, ':$1');
}

export function formatFileName(fileName: string): string {
  fileName = fileName.replace(/\.(tsx?|jsx?|ts|js)$/i, '');

  if (fileName.toLowerCase() === 'index') {
    return '';
  }

  if (fileName.match(/^\[(.+?)\]$/)) {
    fileName = `:${fileName.slice(1, -1)}`;
  }

  return `${ROOT_DIR}${fileName}`;
}
