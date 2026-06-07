import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    // Raise warning limit slightly — hero images are intentionally large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Vite 8 / rolldown requires manualChunks as a function (not an object)
        manualChunks(id: string) {
          // React core — almost never changes between deploys
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          // FullCalendar — large but stable library
          if (id.includes('node_modules/@fullcalendar/')) {
            return 'vendor-fullcalendar'
          }
          // CSS-in-JS — stable
          if (id.includes('node_modules/@emotion/')) {
            return 'vendor-emotion'
          }
          // State management
          if (id.includes('node_modules/zustand/')) {
            return 'vendor-zustand'
          }
        },
      },
    },
    // Enable CSS code splitting per chunk
    cssCodeSplit: true,
  },
  // Inline only very small assets (≤4KB) — keeps image requests explicit
  assetsInlineLimit: 4096,
})
