import path from 'node:path';
import { RouterProps } from './types';

export function configureDefaults(props: Partial<RouterProps> = {}) {
  // Defines default values
  props.dir ??= 'src/app';
  props.output ??= 'src/routes.tsx';
  props.extensions ??= ['.tsx', '.ts', '.jsx', '.js'];
  props.layouts ??= ['layout.tsx', 'layout.jsx'];
  props.router ??= 'BrowserRouter';
  props.root ??= process.cwd();

  // Makes sure the paths are absolute
  props.dir = path.resolve(props.root, props.dir);
  props.output = path.resolve(props.root, props.output);

  return props as RouterProps;
}
