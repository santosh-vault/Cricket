import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.cricapi.com/v1',
        changeOrigin: true,
        rewrite: (path) => {
          // Map /api/fixtures to the actual cricket API endpoint
          if (path === '/api/fixtures') {
            return '/currentMatches?apikey=11cb8225-0dfc-494e-a48b-32957bbd2887&offset=0';
          }
          return path;
        }
      }
    }
  }
});