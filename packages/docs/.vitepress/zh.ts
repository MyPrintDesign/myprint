import { createRequire } from 'module';
import { defineConfig, type DefaultTheme } from 'vitepress';

//@ts-ignore
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export const zh = defineConfig({
    lang: 'zh-Hans',
    description: '操作简单，组件丰富的一站式打印解决方案打印设计器',

    themeConfig: {
        nav: nav(),

        sidebar: {
            '/guide/': { base: '/guide/', items: sidebarGuide() }
        },

        editLink: {
            pattern: 'https://github.com/MyPrintDesign/myprint/edit/main/packages/docs/:path',
            text: '在 GitHub 上编辑此页面'
        },

        footer: {
            message: '本文档内容版权属于 MyPrint 作者，保留所有权利 ',
            copyright: `版权所有 © 2019-${new Date().getFullYear()} css <a href="https://beian.miit.gov.cn/" target="_blank" class="beian_a">皖ICP备18011566号-4</a>`
        },

        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        outline: {
            label: '页面导航'
        },

        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },

        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
    }
});

function nav(): DefaultTheme.NavItem[] {
    return [{ text: '首页', link: '/' },
        {
            text: '文档',
            link: '/guide/whatIs-my-print',
            activeMatch: '/guide/'
        },
        {
            text: pkg.version,
            items: [
                {
                    text: '更新日志',
                    link: 'https://github.com/MyPrintDesign/myprint/blob/main/CHANGELOG.md'
                },
                // {
                //     text: '参与贡献',
                //     link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
                // }
            ]
        }
    ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
    return [{
        text: '简介',
        items: [
            { text: '什么是MyPrint', link: 'whatIs-my-print' },
            { text: '安装', link: 'install' },
            { text: '快速开始', link: 'getting-started' }
        ]
    }, {
        text: '使用',
        items: [
            { text: '设计面板', link: '/use-api/design-panel' },
            { text: '组件使用', link: '/use-api/design-panel-use' },
            { text: 'API使用示例', link: '/use-api/api-example' }
        ]
    }, {
        text: '部署',
        items: [
            { text: '客户端', link: '/deploy/client' },
            { text: '服务端部署Centos', link: '/deploy/centos' },
            { text: '服务端部署Debian', link: '/deploy/debian' },
            { text: '服务端部署Docker', link: '/deploy/docker' },
            { text: '服务端部署k8s', link: '/deploy/k8s' }
        ]
    }, {
        text: '参考',
        items: [
            { text: '常见问题', link: '/reference/question' },
            { text: '集思广益', link: '/reference/join' }
        ]
    }
    ];
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
    root: {
        placeholder: '搜索文档',
        translations: {
            button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
            },
            modal: {
                searchBox: {
                    resetButtonTitle: '清除查询条件',
                    resetButtonAriaLabel: '清除查询条件',
                    cancelButtonText: '取消',
                    cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                    recentSearchesTitle: '搜索历史',
                    noRecentSearchesText: '没有搜索历史',
                    saveRecentSearchButtonTitle: '保存至搜索历史',
                    removeRecentSearchButtonTitle: '从搜索历史中移除',
                    favoriteSearchesTitle: '收藏',
                    removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                    titleText: '无法获取结果',
                    helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                    searchByText: '搜索提供者'
                },
                noResultsScreen: {
                    noResultsText: '无法找到相关结果',
                    suggestedQueryText: '你可以尝试查询',
                    reportMissingResultsText: '你认为该查询应该有结果？',
                    reportMissingResultsLinkText: '点击反馈'
                }
            }
        }
    }
};
