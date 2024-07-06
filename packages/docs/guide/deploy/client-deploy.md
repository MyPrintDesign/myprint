# 安装

---

# 前置准备

<script setup>
import { MyPrinter } from '@myprint/design/printer';

MyPrinter.printer({ previewDataList: [] })
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
</script>

## 下载 {#download}

|         | 架构    |              地址              |
|---------|-------|:----------------------------:|
| Windows | X86   | [下载地址](http://www.baidu.com) |
| Linux   | x86   | [下载地址](http://www.baidu.com) |
| Macos   | arm64 | [下载地址](http://www.baidu.com) |
