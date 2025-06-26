import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <- permite acesso externo via Tailscale ou rede
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});
