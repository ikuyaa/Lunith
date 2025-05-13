import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from "@tailwindcss/vite"
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react({
          babel: {
            plugins: [
              //This is needed to use signals from preact
              ["module:@preact/signals-react-transform"]
            ]
          }
        }),
    tailwindcss(),
    ViteImageOptimizer({
      
    })
  ],
  build: {
    outDir: '../dist/frontend',
    cssTarget: 'chrome61'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:42069',
        changeOrigin: true,
      }
    }
  },
})
