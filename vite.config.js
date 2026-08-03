import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración compatible con Vite v8 / Rolldown para Vercel
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Desactiva los sourcemaps para liberar memoria RAM durante el build
    sourcemap: false,
    // Eleva el límite para evitar bloqueos por tamaño de archivos
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Objeto manualChunks con sintaxis compatible
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
        },
      },
    },
  },
});