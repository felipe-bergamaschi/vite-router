import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Router from 'vite-plugin-router';

export default defineConfig({
  plugins: [react(), Router()]
});
