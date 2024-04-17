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
    host: '0.0.0.0',
    proxy: {
      '/socket.io': {
        target: 'http://127.0.0.1:9876/',
        ws: true,
        changeOrigin: true,
      },
      '/api/peer_signal': {
        target: 'http://127.0.0.1:9877',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api': {
        target: 'http://127.0.0.1:9876',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
