import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',

    server: {
        host: '0.0.0.0',
        port: 7080,
        proxy: { //配置多个代理
            '/api': {
                // target: 'http://127.0.0.1:2020/',
                target: "https://demo.server.myprint.top/",
                changeOrigin: true,///设置访问目标地址允许跨域
                rewrite: (p) => p.replace(/^\/api/, '')
            }
        }
    },
    define: {
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': true, // 设置为 true 或 false，根据你的需求
        'process.env': {
            'BASE_API': ''
        }
    },
    plugins: [vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        })
    ],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@myprint/design': fileURLToPath(new URL('../design/src', import.meta.url))
        }
    }
});
