export interface IViteRouterPros {
  dir?: string;
  outDir?: string;
}

export interface IViteRouterPlugin {
  name: string;
  configureServer(): void;
  closeBundle(): void;
}

