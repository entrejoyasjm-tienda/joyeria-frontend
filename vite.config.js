import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600, // Eleva el límite para evitar avisos por archivos grandes
    sourcemap: false,           // Desactiva sourcemaps para acelerar la compilación en Vercel
  },
});