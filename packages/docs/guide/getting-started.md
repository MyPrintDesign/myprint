# 快速开始

本节将介绍如何在项目中使用 My-print。
::: tip 示例仓库

[`github`](https://github.com/MyPrintDesign/myprint)

[`gitee`](https://gitee.com/MyPrintDesign/myprint)

[点击体验](./use-api/design-panel)
:::

::: tip 示例仓库

如果您对vue3项目不熟悉，请参考示例项目 [`github`](https://github.com/MyPrintDesign/myprint-examples) [`gitee`](https://gitee.com/MyPrintDesign/myprint-examples)

:::

## 导入

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createPrint, MyPrinter } from 'myprint-design';
// 引入样式文件
import 'myprint-design/css/index.css';

const app = createApp(App);

// 设置pdf服务器地址(可选)
MyPrinter.initMyPrinter({
    serverUrl: 'http://q-jiang.com:19898/', // 服务器地址
    // disabledClient: true // 是否禁用客户端连接
});

app.use(createPrint); // 安装 myprint
app.mount('#app');
```

## 使用

```vue
<script setup lang="ts">
import {DesignPanel, Panel, Template} from 'myprint-design';

const emit = defineEmits(['back'])

const templateContent = {
    width: 100,
    height: 100,
    pageUnit: 'mm',
    elementList: [{
        type: 'Text',
        x: 10,
        y: 10,
        width: 50,
        height: 10,
        data: '磨刀霍霍向厨房',
        option: {
            textAlign: 'center',
            verticalAlign: 'center'
        }
    },
        {// 时间
            type: 'TextTime',
            x: 10,
            y: 20,
            width: 50,
            height: 10,
            option: {
                formatter: '{{yyyy年MM月dd日 hh:mm:ss}}',
                textAlign: 'center',
                verticalAlign: 'center'
            }
        },
        {// 图片
            type: 'Image',
            x: 10,
            y: 30,
            width: 20,
            height: 20
        }, {// 横实线
            type: 'Image',
            x: 10,
            y: 30,
            width: 20,
            height: 20
        }]
} as Panel;
const template = {
    content: JSON.stringify(templateContent)
} as Template;

</script>

<template>
    <!-- 如果不需要设计面板，只是打印，可以不需要引用这个组件 -->
    <!-- 这个组件仅仅是面板组件 -->
    <design-panel :template="template"
                  class="design-panel-custom"
                  @back="emit('back')"
                  :module="{
    provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'}),
    previewData: '[{}]'
  }" />
</template>

<style>
    .design-panel-custom {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100vh - 20px);
    }
</style>
```
