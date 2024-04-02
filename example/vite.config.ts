import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// @ts-ignore
import { ViteRouter } from '../src';

export default defineConfig({
  plugins: [
    react(),
    // @ts-ignore 
    ViteRouter()
  ]
});
