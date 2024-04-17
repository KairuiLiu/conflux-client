import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.MODE': JSON.stringify(process.env.MODE),
  },
  server: {
    proxy: {
      host: '0.0.0.0',
      '/api': {
        target: 'http://127.0.0.1:9876',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/socket.io': {
        target: 'ws://127.0.0.1:9876',
        ws: true,
      },
    },
  },
});
