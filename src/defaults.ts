import path from 'node:path';
import { RouterProps } from './types';

export function configureDefaults(props: Partial<RouterProps> = {}) {
  // Defines default values
  props.dir ??= 'src/pages';
  props.output ??= 'src/routes.tsx';
  props.extensions ??= ['.tsx', '.ts', '.jsx', '.js'];
  props.layouts ??= ['layout.tsx', 'layout.jsx'];

  // Makes sure the paths are absolute
  props.dir = path.resolve(process.cwd(), props.dir);
  props.output = path.resolve(process.cwd(), props.output);

  return props as RouterProps;
}
