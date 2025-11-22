import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  plugins: [
    react(),
    {
      name: 'svg-transform',
      load(id) {
        if (id.endsWith('.svg')) {
          return 'export default "svg-mock"'
        }
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
  },
})

