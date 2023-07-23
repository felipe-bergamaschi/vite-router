import { IRoute, File } from "../types";

export function getCustomLayoutName(path: string | null) {
  if (!path) return null;
  // Remover barras '/'
  let name = path.replace(/\//g, '');

  // Remover colchetes []
  name = name.replace(/\[(.*?)\]/g, (match) => {
    const paramName = match.substring(1, match.length - 1);
    return paramName.charAt(0).toUpperCase() + paramName.slice(1);
  });

  // Capitalizar o nome
  name = name.charAt(0).toUpperCase() + name.slice(1);

  // Remover caracteres especiais
  name = name.replace(/[^\w\s]/gi, '');

  // Remover acentos
  name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Verificar se o nome está vazio
  if (name === '') {
    // Definir "Root" como padrão se o path for '/'
    name = 'Root';
  }

  return `${name}Layout`;
}

export function formatPathFromFilename(filename: string) {
  const extensionRemoved = filename.replace(/\.(tsx?|jsx?|ts|js)$/i, '');

  if (extensionRemoved === 'index') {
    return '';
  } else {
    return `/${extensionRemoved}`;
  }
}

export function getImporPath(path: string, file: string) {
  if (path === '/' && file.includes('index')) {
    return './app/index';
  }

  return `./app${path !== '/' ? path : ''}${formatPathFromFilename(file)}`;
}

export function generateImports(routes: IRoute[]) {
  return routes
    .map(({ path, name }, index) => {
      const fileName = `File${index + 1}`;
      const filePath = getImporPath(path, name);

      return `const ${fileName} = lazy(() => import('${filePath}'));`;
    })
    .join('\n');
}

export function generateLayoutImports(layouts: File[]) {
  return layouts
    .map(({ path, name }) => {
      const fileName = getCustomLayoutName(path);

      const filePath = `./app${path !== '/' ? path : ''}${formatPathFromFilename(name)}`;

      return `const ${fileName} = lazy(() => import('${filePath}'));`;
    })
    .join('\n');
}

export function generateRoutes(routes: IRoute[]) {
  return routes
    .map(({ route, layout }, index) => {
      const fileName = `File${index + 1}`;
      const layoutName = getCustomLayoutName(layout);

      const processedLayout =
        layoutName === null
          ? `<${fileName} />`
          : `
              <${layoutName}>
                <${fileName} />
              </${layoutName}>
            `;

      return `
          <Route 
            element={${processedLayout}} 
            path="${route === '' ? '/' : route}" 
            key="${route === '' ? '/' : route}"  
          />`;
    })
    .join('\n        ');
}
