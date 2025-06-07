import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 5173
    },
    proxy: {
      // Проксирование запросов для обхода CORS
      '/api/v1': {
        target: 'http://26.57.221.158:8090',
        changeOrigin: true,
        secure: false,
        // Не переписываем пути, так как сервер ожидает именно /api/v1
        // rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    }
  }
})
