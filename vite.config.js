import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración estándar para Vite 5
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});