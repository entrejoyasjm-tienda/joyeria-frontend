import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite optimizada para evitar fallos de compilación en Vercel
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Desactiva los sourcemaps para ahorrar memoria
    sourcemap: false,
    // Define esbuild como minificador estable
    minify: 'esbuild',
    // Desactiva advertencias de tamaño excesivo que interrumpen el build
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignora advertencias no críticas durante el build en Vercel
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      },
      output: {
        // Divide el código en paquetes pequeños
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
        },
      },
    },
  },
});