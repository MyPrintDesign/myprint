import { createServer } from 'vite';
import { resolvePackagePath } from './util';
import pluginVue from '@vitejs/plugin-vue';
import pluginVueJsx from '@vitejs/plugin-vue-jsx';
import {fileURLToPath, URL} from "node:url";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import vue from '@vitejs/plugin-vue'

(async () => {
  const server = await createServer(
  //     {
  //   base: './',
  //   configFile: false,
  //   root: resolvePackagePath('business'),
  //   plugins: [pluginVue(), pluginVueJsx()],
  //   server: {
  //     port: 8080,
  //   },
  // }
      {

        base: './',
          root: resolvePackagePath('business'),
        server: {
          host: '0.0.0.0',
          port: 7080,
          proxy: { //配置多个代理
            '/api': {
              // target: "http://127.0.0.1:2020/",
              target: "http://q-jiang.com:35009/",
              changeOrigin: true,///设置访问目标地址允许跨域
              rewrite: (p) => p.replace(/^\/api/, '')
            }
          }
        },
        define: {
          'process.env': {
            'BASE_API': ''
          }
        },
        plugins: [vue()
          // AutoImport({
          //   resolvers: [ElementPlusResolver()],
          // }),
          // Components({
          //   resolvers: [ElementPlusResolver()],
          // }),
        ],

        resolve: {
          alias: {
            '@': fileURLToPath(new URL('../packages/business/src', import.meta.url)),
            '@myprint/design': fileURLToPath(new URL('../packages/design/src', import.meta.url)),
          }
        }
      }

  );

  await server.listen();

  server.printUrls();
})();
