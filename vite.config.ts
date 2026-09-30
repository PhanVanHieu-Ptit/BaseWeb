import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { msw } from 'msw/vite'
import { defineConfig, loadEnv } from 'vite'

import { parseEnv } from './src/config/env.schema.ts'

export default defineConfig(({ command, mode }) => {
  // Fail fast: an invalid environment stops the dev server / build with a readable message
  // instead of shipping a blank page.
  parseEnv(loadEnv(mode, process.cwd(), 'VITE_'))

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Serves /mockServiceWorker.js in development only. Nothing is emitted into production builds.
      ...(command === 'serve' ? [msw()] : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          // Long-lived vendor chunks: they change far less often than application code,
          // so browsers keep them cached across deployments.
          codeSplitting: {
            groups: [
              { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'data-vendor', test: /node_modules[\\/](@tanstack|axios|zustand|zod)[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
