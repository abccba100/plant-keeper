import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@fullcalendar/')) {
            return 'vendor-fullcalendar'
          }
          if (id.includes('node_modules/@emotion/')) {
            return 'vendor-emotion'
          }
          if (id.includes('node_modules/zustand/')) {
            return 'vendor-zustand'
          }
        },
      },
    },
  },
})
