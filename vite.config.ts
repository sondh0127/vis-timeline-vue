import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Svelte({
      preprocess: preprocess({}),
    }),
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
