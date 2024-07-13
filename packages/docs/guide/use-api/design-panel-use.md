# 设计面板

:::tip :tada: :100:快速体验:100: :tada:
[点击体验](./design-panel)
:::

```vue

<template>
    <design-panel :template="null!" :module="{
    provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'} as Provider),
    previewData: '[{}]'
  }" />
</template>

<script setup lang="ts">
    import { DesignPanel, Provider } from "myprint-design";
    
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

## 属性

| 属性名               | 说明           |                                 类型                                 | 默认值   |
|-------------------|--------------|:------------------------------------------------------------------:|-------|
| module            | 模块           |                        [`Module`](#Module)                         | —     |
| template          | 模版           |                      [`Template`](#Template)                       | —     |
| height            | 高度           |                               string                               | —     |
| saveTemplate      | 保存模版         | Function<br/>`(template: Template) => `[`SaveResult`](#SaveResult) | —     |
| generateImg       | 模版模版时，是否生成图片 |                              boolean                               | false |
| showBackButton    | 是否显示左上角返回按钮  |                              boolean                               | true  |
| showPrintButton   | 是否显示打印按钮     |                              boolean                               | true  |
| showPreviewButton | 是否显示预览按钮     |                              boolean                               | true  |
| showClearButton   | 是否显示清空按钮     |                              boolean                               | true  |
| showSaveButton    | 是否显示保存按钮     |                              boolean                               | true  |

## 事件

| 事件名      | 说明                                  |    类型    |
|----------|-------------------------------------|:--------:|
| back     | 模块                                  | Function |
| panelImg | 模版保存时，生成图片，当`generateImg = true`时生效 | Function |

## Types

### Module {#Module}

```ts
/**
 * 模块
 */
export interface Module {
    id?: string | number;
    originId?: any;
    userId?: number;
    moduleGroupId?: number | string;
    name?: string;
    provider?: string;
    previewData?: string;
    previewDataByte?: any;
}
```

### Template {#Template}

```ts
/**
 * 模版
 */
export interface Template {
    id?: string | number;
    userId?: any;
    moduleId?: string | number;
    name?: string;
    content?: any;
    coverImgUrl?: any;
    coverImgList?: ArrayBuffer[];
    module?: Module;
    moreVisible?: boolean;
}

```

### SaveResult {#SaveResult}

```ts
/**
 * 打印结果
 */
export interface SaveResult {
    status: 'SUCCESS' | 'ERROR';
}
```
