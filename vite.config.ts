import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.join(__dirname, 'static'),
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
