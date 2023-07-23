import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Router from 'vite-plugin-router'

export default defineConfig({
  plugins: [react(), Router()],
})
