# 设计面板

:::tip :tada: :100:快速体验:100: :tada:
[点击体验](./design-panel)
:::

## 引用设计面板

```vue

<script setup lang="ts">
    import { DesignPanel, Panel, Template } from 'myprint-design';
    
    const emit = defineEmits(['back'])
    
    const templateContent = '{"width":100,"height":100,"pageUnit":"mm","elementList":[{"type":"Text","x":10,"y":10,"width":50,"height":10,"data":"磨刀霍霍向厨房","option":{"textAlign":"center","verticalAlign":"center"}},{"type":"TextTime","x":10,"y":20,"width":50,"height":10,"option":{"formatter":"{{yyyy年MM月dd日 hh:mm:ss}}","textAlign":"center","verticalAlign":"center"}},{"type":"Image","x":10,"y":30,"width":20,"height":20},{"type":"Image","x":10,"y":30,"width":20,"height":20}]}';
    const template = {
        content: templateContent
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

## 引用ts代码直接调用预览面板

```vue

<script setup lang="ts">
    import { MyPrinter } from 'myprint-design';
    
    function clickChromePreview() {
        MyPrinter.chromePreview({
            panel: '{"width":100,"height":100,"pageUnit":"mm","elementList":[{"type":"Text","x":10,"y":10,"width":50,"height":10,"data":"磨刀霍霍向厨房","option":{"textAlign":"center","verticalAlign":"center"}},{"type":"TextTime","x":10,"y":20,"width":50,"height":10,"option":{"formatter":"{{yyyy年MM月dd日 hh:mm:ss}}","textAlign":"center","verticalAlign":"center"}},{"type":"Image","x":10,"y":30,"width":20,"height":20},{"type":"Image","x":10,"y":30,"width":20,"height":20}]}',
            previewDataList: [{}],
            timeout: 10 * 1000
        })
            .then(res => {
                // 预览页面进行打印时，回调，预览页面的停留时间也会记入超时时间
                if (res.status == 'SUCCESS') {
                    console.log('打印成功');
                } else if (res.status == 'ERROR') {
                    console.log('打印失败', res.msg);
                } else if (res.status == 'TIMEOUT') {
                    console.log('打印超时');
                }
            });
    }
</script>

<template>
    <button @click="clickChromePreview()">点击尝试打开预览页面</button>
</template>

```

<script setup lang="ts">
    import { inBrowser } from 'vitepress';
    import { computed } from 'vue';
    import { template } from '../../examples/constant'; 

    let MyPrinter = null;
    if(inBrowser){
         import('@myprint/design').then(module=>{
                MyPrinter = module.MyPrinter;
         });
    }

    function clickChromePreview() {
        MyPrinter.chromePreview({ panel: '{"width":100,"height":100,"pageUnit":"mm","elementList":[{"type":"Text","x":10,"y":10,"width":50,"height":10,"data":"磨刀霍霍向厨房","option":{"textAlign":"center","verticalAlign":"center"}},{"type":"TextTime","x":10,"y":20,"width":50,"height":10,"option":{"formatter":"{{yyyy年MM月dd日 hh:mm:ss}}","textAlign":"center","verticalAlign":"center"}},{"type":"Image","x":10,"y":30,"width":20,"height":20},{"type":"Image","x":10,"y":30,"width":20,"height":20}]}', 
            previewDataList: [{}],
            timeout: 10 * 1000})
            .then(res => {
                // 预览页面进行打印时，回调，预览页面的停留时间也会记入超时时间
                if (res.status == 'SUCCESS') {
                    console.log('打印成功');
                } else if (res.status == 'ERROR') {
                    console.log('打印失败', res.msg);
                } else if (res.status == 'TIMEOUT') {
                    console.log('打印超时');
                }
            });
    }

</script>

<button class="doc_open_preview_panel" @click="clickChromePreview()">打开预览页面</button>

## 属性

| 属性名                   | 说明                                          |                                 类型                                 | 默认值   |
|-----------------------|---------------------------------------------|:------------------------------------------------------------------:|-------|
| module                | 模块                                          |                        [`Module`](#Module)                         | —     |
| template              | 打印模版                                        |                      [`Template`](#Template)                       | —     |
| height                | 设计面板高度                                      |                               string                               | —     |
| saveTemplate          | 保存模版，需要返回保存状态，用于判断是否保存成功                    | Function<br/>`(template: Template) => `[`SaveResult`](#SaveResult) | —     |
| generateImg           | 模版模版时，是否生成图片，如果为true，保存之后会触发一个`panelImg` 事件 |                              boolean                               | false |
| showBackButton        | 是否显示左上角返回按钮                                 |                              boolean                               | true  |
| showPrintButton       | 是否显示打印按钮                                    |                              boolean                               | true  |
| showDownloadPdfButton | 是否显示下载pdf按钮                                 |                              boolean                               | true  |
| showPreviewButton     | 是否显示预览按钮                                    |                              boolean                               | true  |
| showClearButton       | 是否显示清空按钮                                    |                              boolean                               | true  |
| showSaveButton        | 是否显示保存按钮                                    |                              boolean                               | true  |

## 事件

| 事件名      | 说明                                  |                  类型                  |
|----------|-------------------------------------|:------------------------------------:|
| back     | 点击返回按钮                              |         Function`() => void`         |
| panelImg | 模版保存时，生成图片，当`generateImg = true`时生效 | Function`(blobList: Blob[]) => void` |

## Types

### Module {#Module}

```ts
/**
 * 模块
 */
interface Module {
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
interface Template {
    id?: string | number;
    userId?: any;
    moduleId?: string | number;
    name?: string;
    content?: any;// 涉及模版内容
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
interface SaveResult {
    status: 'SUCCESS' | 'ERROR';
}
```

<style lang="css">
.doc_open_preview_panel {
    padding-left : 15px;
    padding-right : 15px;
    border-radius: 50px;
    border: var(--vp-c-brand-1) 3px solid;
    transition: background 0.5s ease, color 0.5s ease;
}
.doc_open_preview_panel:hover {
    color: white;
    background: var(--vp-c-brand-1);
}
</style>
