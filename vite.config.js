import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Desactiva la minificación agresiva temporalmente para obtener mensajes de error detallados
    minify: true,
    // Asegura compatibilidad con entornos Linux en Vercel
    target: 'esnext',
  },
  // Forzar la resolución limpia de extensiones .jsx y .js
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});