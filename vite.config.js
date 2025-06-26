import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Dla custom domain ZAWSZE '/'
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild instead of terser (faster, built-in)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('three')) {
              return 'three';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            return 'vendor';
          }
        }
      }
    },
    // Kopiuj CNAME dla GitHub Pages custom domain
    copyPublicDir: true
  },
  publicDir: 'public',
  server: {
    port: 5173,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['three', 'recharts']
  }
})