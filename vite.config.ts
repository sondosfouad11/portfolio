import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { vercelApiDev } from './scripts/vite-api.ts'
import { preloadCritical } from './scripts/vite-preload.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Make server-only variables from .env (RESEND_API_KEY, ...) visible to the /api functions in dev.
  // They are NOT exposed to the browser: only VITE_* variables are.
  Object.assign(process.env, { ...loadEnv(mode, process.cwd(), ''), ...process.env })

  return {
    plugins: [react(), vercelApiDev(), preloadCritical()],
    build: {
      rolldownOptions: {
        output: {
          // Keep the big animation libraries in their own cacheable files.
          codeSplitting: {
            groups: [
              { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)/ },
              { name: 'gsap', test: /node_modules[\\/](gsap|lenis)/ },
            ],
          },
        },
      },
    },
  }
})
