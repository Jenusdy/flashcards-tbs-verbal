import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/flashcards-tbs-verbal/', // Sesuaikan dengan nama repository
})
