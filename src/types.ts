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

