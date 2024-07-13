# 快速开始
本节将介绍如何在项目中使用 My-print。
::: tip 示例仓库
 [gitee]

[github]
:::

## 导入
```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import {createPrint, MyPrinter} from "myprint-design/src";
// 引入样式文件
import 'myprint-design/css/index.css';

const app = createApp(App)

// 设置pdf服务器地址(可选)
MyPrinter.setServerUrl(import.meta.env.VITE_API_PDF_SERVER_URL);

app.use(createPrint);
app.mount('#app')
```

## 使用
```vue
<template>
 <design-panel :template="null!" :module="{
    provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'} as Provider),
    previewData: '[{}]'
  }"/>
</template>

<script setup lang="ts">
// HelloWorld.vue

import {DesignPanel, Provider} from "myprint-design";

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

```
