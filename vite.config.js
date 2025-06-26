import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          charts: ['recharts']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['three', 'recharts']
  }
})