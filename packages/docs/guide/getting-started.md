# 快速开始
本节将介绍如何在项目中使用 My-print。
::: tip 示例仓库

[`gitee`](https://gitee.com/MyPrintDesign/myprint)

[`github`](https://github.com/MyPrintDesign/myprint)

[点击体验](./use-api/design-panel)
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
    disabledClient: true // 是否禁用客户端连接
});

app.use(createPrint); // 安装 myprint
app.mount('#app');
```

## 使用

如果您对vue3项目不熟悉，请参考示例项目 [`gitee`](https://gitee.com/MyPrintDesign/myprint-examples) [`github`](https://github.com/MyPrintDesign/myprint-examples)

```vue

<script setup lang="ts">
    // HelloWorld.vue
    
    import { DesignPanel, Provider } from 'myprint-design';
    
    // defineProps<{ msg: Template }>()
    
    
    // MyPrinter.preview({previewDataList: []})
    //     .then(res => {
    //       // 预览页面进行打印时，回调，预览页面的停留时间也会记入超时时间
    //       if (res.status == 'SUCCESS') {
    //         console.log('打印成功');
    //       } else if (res.status == 'ERROR') {
    //         console.log('打印失败', res.msg);
    //       } else if (res.status == 'TIMEOUT') {
    //         console.log('打印超时');
    //       }
    //     });


</script>

<template>
    <design-panel :template="null!" :module="{
    provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'}),
    previewData: '[{}]'
  }" />
</template>

```
