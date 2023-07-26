import { ROOT_DIR } from '../constants';
import { File, IRoute, ProcessedRoute } from '../types';

function findLayoutForFile(files: ProcessedRoute, layouts: File[]) {
  const pathSegments = files.path.split(ROOT_DIR).filter((segment) => segment !== '');

  for (let i = pathSegments.length; i >= 0; i--) {
    const currentPath = `${ROOT_DIR}${pathSegments.slice(0, i).join(ROOT_DIR)}`;
    const matchingLayout = layouts.find((layout) => layout.path === currentPath);

    if (matchingLayout) {
      return matchingLayout.path;
    }
  }

  return null;
}

export function findLayout(files: ProcessedRoute[], layouts: File[]): IRoute[] {
  return files.map((file) => {
    const layout = findLayoutForFile(file, layouts);

    return {
      ...file,
      layout
    };
  });
}
