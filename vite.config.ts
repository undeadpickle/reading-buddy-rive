/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/managers': resolve(__dirname, './src/managers'),
      '@/rive': resolve(__dirname, './src/rive'),
      '@/utils': resolve(__dirname, './src/utils'),
    },
  },
  assetsInclude: ['**/*.riv'],
  optimizeDeps: {
    // No exclusions needed for react-canvas
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          rive: ['@rive-app/react-canvas'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  server: {
    port: 3000,
    open: true,
  },
})