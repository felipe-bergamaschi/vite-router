import type { ReactNode } from 'react';

/** Properties that can be passed to the plugin */
export interface RouterProps {
  /**
   * Path to the app directory
   *
   * @default 'src/app'
   */
  dir: string;

  /**
   * Root of your project
   *
   * @default process
   */
  root: string;

  /**
   * Output path for the `routes` file.
   *
   * @default 'src/routes.tsx'
   */
  output: string;

  /**
   * Match the file extensions to be used for the plugin
   *
   * @default ['.tsx', '.ts', '.jsx', '.js']
   */
  extensions: string[];

  /**
   * Matches all layout files
   *
   * @default ['layout.tsx', 'layout.jsx']
   */
  layouts: string[];

  /** Called when the routes are generated */
  onRoutesGenerated?: (routes: Route[]) => void;

  /**
   * Chooses the router to be used
   *
   * @default 'BrowserRouter'
   */
  router: 'BrowserRouter' | 'HashRouter';
}

export interface RouteProps {
  /**
   * If we should use a different 404 component instead of a <div>404</div>
   *
   * @default undefined
   */
  notFoundPage?: ReactNode;

  /**
   * If we should use a different loading component instead of a <div>Loading...</div>
   *
   * @default undefined
   */
  loadingPage?: ReactNode;
}

/** @internal */
export interface Layout {
  path: string;
  index: number;
}

/** @internal */
export interface Route {
  path: string;
  directory: string;
  route: string;
  index: number;
  layout?: Layout;
}
