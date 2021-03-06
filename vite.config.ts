import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
    }),
    Unocss({ /* options */ }),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
