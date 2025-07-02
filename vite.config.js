import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@components': path.resolve(__dirname, 'src/components'),
    }
  }
});
