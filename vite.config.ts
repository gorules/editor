import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  build: {
    outDir: path.join(__dirname, 'static'),
    target: 'esnext',
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    https: {
      cert: path.join(__dirname, 'cert', 'localhost.pem'),
      key: path.join(__dirname, 'cert', 'localhost-key.pem'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
