export interface IViteRouterPros {
  dir?: string;
  outDir?: string;
}

export interface IViteRouterPlugin {
  name: string;
  configureServer(): void;
  closeBundle(): void;
}

export interface File {
  path: string;
  name: string;
}

export interface ProcessedRoute {
  path: string;
  name: string;
  route: string;
}

export interface IProcessFiles {
  files: ProcessedRoute[];
  layouts: File[];
}

export interface IRoute {
  name: string;
  path: string;
  route: string;
  layout: string | null;
}
