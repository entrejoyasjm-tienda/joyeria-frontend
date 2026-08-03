import { defineConfig } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite limpia para evitar errores con Rolldown en Vercel
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactivado para ahorrar memoria durante el empaquetado
    chunkSizeWarningLimit: 3000,
  },
});