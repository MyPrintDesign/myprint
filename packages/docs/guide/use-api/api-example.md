# API 示例

通过js代码直接调用

## 使用示例

## 直接打印

### 客户端打印

调用本地客户端进行打印

> 支持后台静默打印，需要提前安装本地客户端 [如何下载？](../deploy/client-deploy#download)

```ts
import { MyPrinter } from '@myprint/design/printer';

MyPrinter.printer({ previewDataList: previewData.value })
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

```

### 浏览器打印

调用浏览器进行打印，无法后台静默打印，需要用户手动点击打印，无法得知打印结果`(无法知道用户是否取消)`

```ts
import { MyPrinter } from '@myprint/design/printer';

const result = MyPrinter.chromePrinter({ previewDataList: previewData.value });
console.log(result.status);
```

## 预览

唤出预览页面

```ts
<script setup>
import { MyPrinter } from 'myprint-design/src';

function click(){

MyPrinter.preview({ previewDataList: [] })
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


<button  @click="click">示例</button>

```
```ts
import { MyPrinter } from '@myprint/design/printer';

MyPrinter.preview({ previewDataList: previewData.value })
    .then(res => {
        // 预览页面进行打印时，回调，预览页面的停留时间也会记入超时时间
        if (res.status == 'SUCCESS') {
            console.log('打印成功');
        } else if (res.status == 'ERROR') {
            console.log('打印失败', res.msg);
        } else if (res.status == 'TIMEOUT') {
            console.log('打印超时');
        }

        if (res.type == 'CHROME_PRINT') {
            console.log('浏览器打印');
        } else if (res.type == 'CLIENT_PRINT') {
            console.log('客户端打印');
        } else if (res.type == 'CLIENT_GENERATE_PDF') {
            console.log('客户端生成pdf');
        }
    });

```

## 方法说明

| 方法            | 说明                  |                          参数                          |                                                 返回值 |
|---------------|---------------------|:----------------------------------------------------:|----------------------------------------------------:|
| preview       | 预览，会在超时/用户进行打印时进行回调 | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| printer       | 本地客户端打印             | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| chromePrinter | 浏览器打印(直接调用浏览器打印页面)  | (printProps: [PrintProps](./api-example#PrintProps)) |          [`PrintResult`](./api-example#PrintResult) |
| pdfChrome     | 浏览器构建pdf，清晰度较差      | (printProps: [PrintProps](./api-example#PrintProps)) |                                     `Promise<Blob>` |
| pdfClient     | 从本地客户端获取pdf，返回Blob  | (printProps: [PrintProps](./api-example#PrintProps)) |                                     `Promise<Blob>` |
| pdfServer     | 从服务器获取pdf，返回Blob    | (printProps: [PrintProps](./api-example#PrintProps)) |                                     `Promise<Blob>` |
| imgChrome     | 从浏览器获取img，返回Blob    | (printProps: [PrintProps](./api-example#PrintProps)) |                                     `Promise<Blob>` |
| imgServer     | 从服务器获取img，返回Blob    | (printProps: [PrintProps](./api-example#PrintProps)) |                                     `Promise<Blob>` |


## Types

### PrintProps {#PrintProps}

```ts
/**
 * 打印请求参数
 */
export interface PrintProps {
    panel?: Panel | string,
    // appointChannel?: 'SERVER' | 'CHROME' | 'CLIENT',
    previewDataList: any[],
    // 如果 是 null/-1 不设置超时时间
    timeout?: number
}

```

### PrintResult {#PrintResult}

```ts
/**
 * 打印结果
 */
export interface PrintResult {
    status: 'SUCCESS' | 'ERROR' | 'TIMEOUT';
    msg?: string,

    /**
     * CHROME_PRINT 浏览器打印
     * TIMEOUT 超时
     * CLIENT_PRINT 客户端打印
     * CLIENT_GENERATE_PDF 客户端生成pdf
     */
    type: 'CHROME_PRINT' | 'TIMEOUT' | 'CLIENT_PRINT' | 'CLIENT_GENERATE_PDF';
}

```
