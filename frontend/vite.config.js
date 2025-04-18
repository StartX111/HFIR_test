import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Прокси для API-запросов
      '/api': {
        target: 'http://localhost:3000', // URL вашего бэкенда
        changeOrigin: true, // Менять Origin на целевой URL
        secure: false, // Используйте false, если сервер работает через HTTP
        // rewrite: (path) => path.replace(/^\/api/, ''), // Удаляет /api из пути
      },
    },
  },
})
