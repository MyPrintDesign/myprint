// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import '@myprint/design/styles/index.scss';

import { createPrint, MyPrinter } from '@myprint/design/index';

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    enhanceApp({ app, router, siteData }) {
        // ...
        MyPrinter.setServerUrl('http://q-jiang.com:19898/');
        app.use(createPrint);
    }
} satisfies Theme;
