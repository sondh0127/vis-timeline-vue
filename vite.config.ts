import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Svelte(),
    Vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
