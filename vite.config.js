import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración optimizada para garantizar la compilación estable en Vercel
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Desactiva sourcemaps para reducir drásticamente el uso de memoria RAM en la nube
    sourcemap: false,
    // Incrementa el límite para evitar avisos que bloqueen el proceso
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // Fuerza el uso de la estrategia de empaquetado estándar y divide librerías grandes
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@chakra-ui') || id.includes('@emotion') || id.includes('framer-motion')) {
              return 'vendor-ui';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});