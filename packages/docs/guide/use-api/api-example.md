# API 示例

通过js代码直接调用

## 客户端打印

调用本地客户端进行打印

> 支持后台静默打印，需要提前安装本地客户端 [如何下载？](../deploy/client#download)

```ts
// 公共变量
const template = {
    content: '{"width":100,"height":100,"pageUnit":"mm","elementList":[{"type":"Text","x":10,"y":10,"width":50,"height":10,"data":"磨刀霍霍向厨房","option":{"textAlign":"center","verticalAlign":"center"}},{"type":"TextTime","x":10,"y":20,"width":50,"height":10,"option":{"formatter":"{{yyyy年MM月dd日 hh:mm:ss}}","textAlign":"center","verticalAlign":"center"}},{"type":"Image","x":10,"y":30,"width":20,"height":20},{"type":"Image","x":10,"y":30,"width":20,"height":20}]}'
};

/**
 * 浏览器下载pdf到本地
 * @param blob
 * @param fileName
 */
function download(blob: Blob, fileName = 'myprint.pdf') {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
}
```

<script setup lang="ts">

const template = {
    content: '{"width":100,"height":100,"pageUnit":"mm","elementList":[{"type":"Text","x":10,"y":10,"width":50,"height":10,"data":"磨刀霍霍向厨房","option":{"textAlign":"center","verticalAlign":"center"}},{"type":"TextTime","x":10,"y":20,"width":50,"height":10,"option":{"formatter":"{{yyyy年MM月dd日 hh:mm:ss}}","textAlign":"center","verticalAlign":"center"}},{"type":"Image","x":10,"y":30,"width":20,"height":20},{"type":"Image","x":10,"y":30,"width":20,"height":20}]}'
};

import { inBrowser } from 'vitepress';
    import { computed } from 'vue';
    import { template } from '../../examples/constant'; 
    import {ref} from 'vue';
    const clientPrintResult = ref('');
    const printerList = ref([]);
    const asyncPrinterList = ref([]);
    const defaultPrinter = ref({});
    const pdfToPrinterFileUrl = ref('http://file.myprint.top/myprint.pdf');
    const selectedPrinter = ref(undefined);
    const clientUrl = ref('ws://127.0.0.1:9898');

    let MyPrinter = null;
    let MyPrinterRef = ref(null);
    if(inBrowser){
         import('@myprint/design').then(module=>{
                MyPrinter = module.MyPrinter;
            MyPrinterRef.value = MyPrinter;
            clickAsyncGetPrinterList();
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

    /**
     * 浏览器打印
     */
    function clickChromePrint() {
        MyPrinter.chromePrinter({
            panel: template.content,
            previewDataList: [{}]
          }).then(res => {
            console.log(res)
            if (res.status == 'SUCCESS') {
              console.log('打印成功');
            } else if (res.status == 'ERROR') {
              console.log('打印失败', res.msg);
            } else if (res.status == 'TIMEOUT') {
              console.log('打印超时');
            }
          });
    }

    /**
     * 浏览器打印
     */
    function clickClientPrint() {
          MyPrinter.clientPrinter({
            panel: template.content,
            printer: MyPrinter.getDefaultPrinter().name,
            previewDataList: [{}]
          }).then(res => {
            console.log(res)
            if (res.status == 'SUCCESS') {
                clientPrintResult.value = '打印成功'
              console.log('打印成功');
            } else if (res.status == 'ERROR') {
              console.log('打印失败', res.msg);
            clientPrintResult.value = '打印失败：' + res.msg
            } else if (res.status == 'TIMEOUT') {
              console.log('打印超时');
            clientPrintResult.value = '打印超时'
            }
          });
    }

    /**
     * 浏览器生成pdf
     */
    function clickPdfChrome() {
          MyPrinter.pdfChrome({
        panel: template.content,
        previewDataList: [{}]
        }).then(res => {
            console.log(res)
            download(res.blob!)
        });
    }

    /**
     * 客户端生成pdf
     */
    function clickPdfClient() {
        MyPrinter.pdfClient({
            panel: template.content,
            previewDataList: [{}]
        }).then(res => {
            console.log(res)
            download(res.blob!)
        });
    }

    /**
     * 服务端生成pdf
     */
    function clickPdfServer() {
        MyPrinter.pdfServer({
            panel: template.content,
            previewDataList: [{}]
        }).then(res => {
            console.log(res)
            download(res.blob!)
        });
    }

    /**
     * 浏览器生成图片
     */
    function clickImgChrome() {
        MyPrinter.imgChrome({
            panel: template.content,
            previewDataList: [{}]
        }).then(res => {
            console.log(res)
            for (let blob of res.blobList!) {
              download(blob, 'myprint.png')
            }
        });
    }

    /**
     * 服务器生成图片
     */
    function clickImgServer() {
        MyPrinter.imgServer({
            panel: template.content,
            previewDataList: [{}]
        }).then(res => {
            console.log(res)
            download(res.blob!, 'myprint.png')
        });
    }

    /**
     * 获取打印机列表
     */
    function clickGetPrinterList() {
        printerList.value = MyPrinter.getPrinterList()
        console.log(printerList)

    }

    /**
     * 获取打印机列表（异步）
     */
    function clickAsyncGetPrinterList() {
        MyPrinter.asyncGetPrinterList().then(res => {
            console.log(res)
            asyncPrinterList.value = res as any
          }).catch(e => {
            console.log(e)
          });
    }

    /**
     * 获取打印机列表（异步）
     */
    function clickDefaultPrinter() {
        defaultPrinter.value = MyPrinter.getDefaultPrinter();
        console.log(defaultPrinter.value)
    }

    function download(blob: Blob, fileName = 'myprint.pdf') {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }

    function sendPdfToPrinter(){
        fetch(pdfToPrinterFileUrl.value, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf'
                }
            }).then(res => {
                res.blob().then(data => {
                    MyPrinter.clientPrinter({
                        file: data,
                        scale: 'fit',
                        orientation: 'portrait',
                        printer: selectedPrinter.value
                    }).then(s=>{
                        clientPrintResult.value = s
                        console.log(s);
                    }).catch(e=>{
                        console.log(e);
                    });
                });
            });
    }
    function changeClientUrl() {
        MyPrinter.setClientUrl(clientUrl.value)
    }
</script>

## 客户端连接状态

```vue
<span>客户端连接状态: {{MyPrinter.clientConnectIs()? '已连接': '未连接'}}</span>
```

<span>客户端连接状态: {{MyPrinterRef == null? '未连接': MyPrinterRef.clientConnectIs()? '已连接': '未连接'}}</span>



## 修改客户端地址

调用本地客户端进行打印，可以指定打印机，后台静默打印，可以获得打印结果

```ts
MyPrinter.setClientUrl('ws://192.168.1.45:9898')
```

<div>客户端: <input style="border: black 1px solid; padding: 3px; width: 300px" v-model="clientUrl"/></div>
<button class="doc_open_preview_panel" @click="changeClientUrl()">修改</button>

## MyPrint预览面板

```ts
/**
 * 预览面板
 */
function handlePreviewPanel() {
    MyPrinter.chromePreview({
        panel: template.content,
        previewDataList: [{}],
        timeout: 10 * 1000
    }).then(res => {
        // 预览页面进行打印时，回调，预览页面的停留时间也会记入超时时间
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
}
```

<button class="doc_open_preview_panel" @click="clickChromePreview()">打开预览页面</button>

## 浏览器打印

调用浏览器进行打印，无法后台静默打印，需要用户手动点击打印，无法得知打印结果`(无法知道用户是否取消)`

```ts
/**
 * 浏览器打印
 */
function handleChromePrint() {
    MyPrinter.chromePrinter({
        panel: template.content,
        previewDataList: [{}]
    }).then(res => {
        console.log(res)
        if (res.status == 'SUCCESS') {
            console.log('打印成功');
        } else if (res.status == 'ERROR') {
            console.log('打印失败', res.msg);
        } else if (res.status == 'TIMEOUT') {
            console.log('打印超时');
        }
    });

}
```

<button class="doc_open_preview_panel" @click="clickChromePrint()">浏览器打印</button>

## 客户端打印

调用本地客户端进行打印，可以指定打印机，后台静默打印，可以获得打印结果

```ts
MyPrinter.clientPrinter({
    panel: template.content,
    printer: defaultPrinter.value.name,
    previewDataList: [{}]
}).then(res => {
    console.log(res);
    if (res.status == 'SUCCESS') {
        console.log('打印成功');
    } else if (res.status == 'ERROR') {
        console.log('打印失败', res.msg);
    } else if (res.status == 'TIMEOUT') {
        console.log('打印超时');
    }
});
```

<button class="doc_open_preview_panel" @click="clickClientPrint()">客户端打印</button>

<span>打印结果: {{clientPrintResult}}</span>

## 浏览器生成pdf

浏览器通过html转pdf，内容为图片格式，缺点：不清晰

```ts
/**
 * 浏览器生成pdf
 */
function handlePdfChrome() {
    MyPrinter.pdfChrome({
        panel: template.content,
        previewDataList: [{}]
    }).then(res => {
        console.log(res)
        download(res.blob!)
    });
}
```

<button class="doc_open_preview_panel" @click="clickPdfChrome()">浏览器生成pdf</button>

## 客户端生成pdf

调用客户端生成pdf，内容清晰

```ts
/**
 * 客户端生成pdf
 */
function handlePdfClient() {
    MyPrinter.pdfClient({
        panel: template.content,
        previewDataList: [{}]
    }).then(res => {
        console.log(res)
        download(res.blob!)
    });

}
```

<button class="doc_open_preview_panel" @click="clickPdfClient()">客户端生成pdf</button>

## 服务端生成pdf

调用服务端生成pdf，内容格式与客户端生成完全一致，内容清晰

```ts
/**
 * 服务端生成pdf
 */
function handlePdfServer() {
    MyPrinter.pdfServer({
        panel: template.content,
        previewDataList: [{}]
    }).then(res => {
        console.log(res)
        download(res.blob!)
    });
}
```

<button class="doc_open_preview_panel" @click="clickPdfServer()">服务端生成pdf</button>

## 浏览器生成图片

浏览器通过html转图片，多页会生成对个图片，缺点：不清晰

```ts
/**
 * 浏览器生成图片
 */
function handleImgChrome() {
    MyPrinter.imgChrome({
        panel: template.content,
        previewDataList: [{}]
    }).then(res => {
        console.log(res)
        for (let blob of res.blobList!) {
            download(blob, 'myprint.png')
        }
    });
}
```

<button class="doc_open_preview_panel" @click="clickImgChrome()">浏览器生成图片</button>

## 服务端生成图片

调用服务端生成图片，内容清晰，只会返回一张图片，多页拼接成长图。

```ts
/**
 * 服务端生成图片
 */
function handleImgServer() {
    MyPrinter.imgServer({
        panel: template.content,
        previewDataList: [{}]
    }).then(res => {
        console.log(res)
        download(res.blob!, 'myprint.png')
    });

}
```

<button class="doc_open_preview_panel" @click="clickImgServer()">服务端生成图片</button>

## 获取打印机列表（同步）

同步获取打印机列表，如果没获取到，则返回null

```ts
/**
 * 获取打印机列表
 */
function handleGetPrinterList() {
    printerList.value = MyPrinter.getPrinterList()
    console.log(printerList)
}
```

<button class="doc_open_preview_panel" @click="clickGetPrinterList()">获取打印机列表</button>
<br/>
<span>打印机列表：</span>
<br/>
<p v-for="(item, index) in printerList" :key="index">{{index + 1}}、{{ item.displayName }}</p>

## 获取打印机列表（异步）

异步获取打印机列表

```ts
/**
 * 获取打印机列表（异步）
 */
function handleAsyncGetPrinterList() {
    MyPrinter.asyncGetPrinterList().then(res => {
        console.log(res)
        printerList.value = res as any
    }).catch(e => {
        console.log(e)
    });
}
```

<button class="doc_open_preview_panel" @click="clickAsyncGetPrinterList()">获取打印机列表</button>
<br/>
<span>打印机列表：</span>
<br/>
<p v-for="(item, index) in asyncPrinterList" :key="index">{{index + 1}}、{{ item.displayName }}</p>

## 获取默认打印机

获取系统设置的默认打印

```ts
/**
 * 获取默认打印机
 */
function handleDefaultPrinter() {
    console.log(MyPrinter.getDefaultPrinter)
    defaultPrinter.value = MyPrinter.getDefaultPrinter();
    console.log(defaultPrinter.value)
}
```

<button class="doc_open_preview_panel" @click="clickDefaultPrinter()">获取默认打印机</button>
<br/>
<span>默认打印机：{{defaultPrinter.displayName}}</span>

## 发送文件到打印机打印

调用本地客户端进行打印，可以指定打印机，后台静默打印，可以获得打印结果

```ts
fetch('http://file.myprint.top/myprint.pdf', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/pdf'
    }
}).then(res => {
    res.blob().then(data => {
        MyPrinter.clientPrinter({
            file: data,
            scale: 'fit',
            orientation: 'portrait',
            printer: selectedPrinter.value
        }).then(s => {
            console.log(s);
        }).catch(e => {
            console.log(e);
        });
    });
});
```

<div>pdf测试URL: <input style="border: black 1px solid; padding: 3px; width: 300px" v-model="pdfToPrinterFileUrl"/></div>
请选择打印机 <select v-model="selectedPrinter" id="fruits">
      <option :value="undefined">请选择</option>
      <option v-for="fruit in asyncPrinterList" :key="fruit.name" :value="fruit.displayName">
        {{ fruit.displayName }}
      </option>
    </select>
<br/>
<button class="doc_open_preview_panel" @click="sendPdfToPrinter()">打印</button>

<span>打印结果: {{clientPrintResult}}</span>

## 方法说明

| 方法                  | 说明                                                        |                          参数                          |                                                 返回值 |
|---------------------|-----------------------------------------------------------|:----------------------------------------------------:|----------------------------------------------------:|
| setLocale           | 设置多语言，页面加载会默认读取<br/>`window.localStorage.getItem('lang')` |            (string: 'zhCn'\|'enUs')=>void            |                                                   — |
| setClientUrl        | 设置客户端地址                                                   |              (clientUrl: string)=>void               |                                                   — |
| setServerUrl        | 设置服务端地址                                                   |              (serverUrl: string)=>void               |                                                   — |
| chromePreview       | 预览页面，会在超时/用户进行打印时进行回调                                     | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| chromePrinter       | 浏览器打印(直接调用浏览器打印页面)                                        | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| clientPrinter       | 本地客户端打印                                                   | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| pdfChrome           | 浏览器构建pdf，清晰度较差                                            | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| pdfClient           | 从本地客户端获取pdf，返回Blob                                        | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| pdfServer           | 从服务器获取pdf，返回Blob                                          | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| imgChrome           | 从浏览器获取img，返回Blob                                          | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| imgServer           | 从服务器获取img，返回Blob                                          | (printProps: [PrintProps](./api-example#PrintProps)) | [`Promise<PrintResult>`](./api-example#PrintResult) |
| asyncGetPrinterList | 打印机列表，异步返回                                                | (printProps: [PrintProps](./api-example#PrintProps)) |       [`Promise<Printer[]>`](./api-example#Printer) |
| getPrinterList      | 打印机列表，同步返回，如果没获取到，返回null                                  | (printProps: [PrintProps](./api-example#PrintProps)) |                [`Printer[]`](./api-example#Printer) |
| getDefaultPrinter   | 获取操作系统默认的打印机                                              | (printProps: [PrintProps](./api-example#PrintProps)) |                  [`Printer`](./api-example#Printer) |
| clientConnectIs     | 客户端是否连接                                                   |                          —                           |                                             boolean |

## Types

### PrintProps {#PrintProps}

```ts
/**
 * 打印请求参数
 */
export interface PrintProps {
    taskId?: string,
    title?: string,
    panel?: Panel | string,
    // appointChannel?: 'SERVER' | 'CHROME' | 'CLIENT',
    previewDataList: any[],
    // 如果 是 null/-1 不设置超时时间
    timeout?: number

    file?: Blob | ArrayBuffer | Uint8Array | string, // 要发送给打印机的文件，这个参数合上面的panel 只能二选一
    previewDataList?: any[],
    printer?: string, // 打印机
    orientation?: 'portrait' | 'landscape', // 打印方向
    paperSize?: string, // 打印file 时使用
    copies?: number, // 打印份数
    scale?: 'fit', // 是否缩放
    //双面打印 | 单面打印
    side?: 'duplex' | 'simplex',
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
    blob?: Blob,
    blobList?: Blob[],
    /**
     * CHROME_PRINT 浏览器打印
     * TIMEOUT 超时
     * CLIENT_PRINT 客户端打印
     * CLIENT_GENERATE_PDF 客户端生成pdf
     */
    type: 'CHROME_PRINT' | 'TIMEOUT' | 'CLIENT_PRINT' | 'CLIENT_GENERATE_PDF';
}
```

### Printer {#Printer}

```ts
/**
 * 打印机
 */
interface Printer {

    /**
     * a longer description of the printer's type.
     */
    description: string;
    /**
     * the name of the printer as shown in Print Preview.
     */
    displayName: string;
    /**
     * whether or not a given printer is set as the default printer on the OS.
     */
    isDefault: boolean;
    /**
     * the name of the printer as understood by the OS.
     */
    name: string;
    /**
     * an object containing a variable number of platform-specific printer information.
     */
    options: any;
    /**
     * the current status of the printer.
     */
    status: number;
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
