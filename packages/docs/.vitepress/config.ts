import { defineConfig } from 'vitepress';
import { shared } from './shared';
// import { en } from './en';
import { zh } from './zh';
import { mdPlugin } from './plugins';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    ...shared,
    locales: {
        root: { label: '简体中文', ...zh },
        // en: { label: 'English', ...en }
    },
    base: '/',
    outDir: './dist',
    markdown: {
        // markdown-it-anchor 的选项
        // https://github.com/valeriangalliat/markdown-it-anchor#usage
        anchor: {
            // permalink: markdownItAnchor.permalink.headerLink()
        },
        // @mdit-vue/plugin-toc 的选项
        // https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc#options
        toc: { level: [1, 2] },
        config: (md) => {
            // 使用更多的 Markdown-it 插件！
            mdPlugin(md)

        }
    }
});
