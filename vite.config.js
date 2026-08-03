import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 🛠️ 'manualChunks' configurado como FUNCIÓN en lugar de Objeto
        manualChunks(id) {
          // Separa las librerías de node_modules en un chunk independiente
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});