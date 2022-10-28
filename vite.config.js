import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// import Components from 'unplugin-vue-components/vite'
// // import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
// import AutoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue2-jsx'
const config = defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },

  build: {
    minify: true,
  },

  plugins: [
    vue(),
    vueJsx(),
    // Components({
    //   resolvers: [
    //     IconsResolver({
    //       componentPrefix: '',
    //     }),
    //   ],
    //   dts: 'src/components.d.ts',
    // }),
    // Icons(),
    // AutoImport({
    //   imports: ['@vueuse/core'],
    //   dts: 'src/auto-imports.d.ts',
    // }),
  ],

  server: {
    port: 3333,
  },
})

export default config
