// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import '@myprint/design/styles/index.scss';
import { inBrowser } from 'vitepress';

// import { createPrint, MyPrinter } from '@myprint/design/index';

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    // enhanceApp: async (ctx) => {
    //     let { app } = ctx;
    //     DefaultTheme.enhanceApp(ctx);
    //     app.mixin({
    //         async mounted() {
    //             //你自己的插件地址
    //             import('@myprint/design/index').then(module => {
    //                 // console.log(module);
    //                 console.log(123);
    //                 // module.MyPrinter.setServerUrl('http://q-jiang.com:19898/');
    //                 // app.use(module.createPrint);
    //                 // app.component('DesignPanel', module.DesignPanel);
    //                 // Vue.use(module.default);
    //             });
    //         }
    //     });
    // }
    enhanceApp: async ({ app, router, siteData }) => {
        if (inBrowser) {
            //@ts-ignore
            const module = await import('@myprint/design/index');
            module.MyPrinter.initMyPrinter({
                // clientUrl: 'ws://192.168.1.45:9898',
                serverUrl: 'http://q-jiang.com:19898', disabledClient: true });
            app.use(module.createPrint);
        }
        // import('@myprint/design/index').then(module => {
        //     // console.log(module);
        //     // console.log(123);
        //     module.MyPrinter.setServerUrl('http://q-jiang.com:19898/');
        //     app.use(module.createPrint);
        //     // app.component('DesignPanel', module.DesignPanel);
        //     // Vue.use(module.default);
        // });
    }
} satisfies Theme;
