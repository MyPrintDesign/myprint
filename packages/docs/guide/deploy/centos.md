# 安装

在Centos中部署

::: warning 最低配置要求
1核1GB
:::

服务端是用来作为后台服务下载`pdf`或者`图片`的

## 下载

[下载地址](https://file.myprint.top/myprint-server.zip)

```shell
# 进入目录
cd /opt
# 下载文件
wget https://file.myprint.top/myprint-server.tar.gz
# 解压文件
tar -zvxf myprint-server.tar.gz
# 或者 下载.zip压缩包
wget https://file.myprint.top/myprint-server.zip
unzip myprint-server.zip

# 进入目录
cd myprint-server

# 初始化
sh init.sh

# 启动服务
sh start.sh

# 测试服务
curl --request POST \
--output out.pdf \
  --url http://127.0.0.1:19898/print/generatePdf \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: PostmanRuntime-ApipostRuntime/1.1.0' \
  --data '{
    "cmd": "print",
    "content": "<div style=\"  --tcolor: black;\"><div>中文sdf123 - myprint</div></div>",
    "height": 297,
    "width": 210
}'
# 正常会在当前目录下生成out.pdf 文件
# 至此，服务启动成功
# 停止服务
sh stop.sh
```

## 启动报错

```shell

# 检查缺失的依赖项
ldd /root/.cache/puppeteer/chrome/linux-115.0.5790.98/chrome-linux64/chrome | grep not
# 服务器返回
[root@VM-96-17-centos chrome-linux64]# ldd chrome | grep not
        libnss3.so => not found
        libnssutil3.so => not found
        libsmime3.so => not found
        libnspr4.so => not found
        libatk-1.0.so.0 => not found
        libatk-bridge-2.0.so.0 => not found
        libdrm.so.2 => not found
        libatspi.so.0 => not found
        libXcomposite.so.1 => not found
        libXdamage.so.1 => not found
        libXfixes.so.3 => not found
        libXrandr.so.2 => not found
        libgbm.so.1 => not found
        libpango-1.0.so.0 => not found
        libasound.so.2 => not found
        
# 以上依赖缺失，注不同服务器，缺失依赖不同，只要把缺失的库都安装之后，检查不报错就行

# 安装依赖，如果有报错，就删掉对应的依赖
yum install -y nss libdrm mesa-libgbm libXcomposite libXcursor libXdamage libXext libXi libXtst cups-libs libXScrnSaver libXrandr alsa-lib atk at-spi2-atk gtk3 libdrm-devel

# 理论上上面执行完，再执行检查 
ldd /root/.cache/puppeteer/chrome/linux-115.0.5790.98/chrome-linux64/chrome | grep not 
# 这个命令就不会有错误了
```

## 其他错误

```shell
Error: Failed to launch the browser process!
/root/.cache/puppeteer/chrome/linux-115.0.5790.98/chrome-linux64/chrome: error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory


TROUBLESHOOTING: https://pptr.dev/troubleshooting

    at Interface.onClose (/snapshot/myprint-node-server/node_modules/@puppeteer/browsers/lib/cjs/launch.js:277:24)
    at Interface.emit (node:events:549:35)
    at Interface.close (node:internal/readline/interface:536:10)
    at Socket.onend (node:internal/readline/interface:262:10)
    at Socket.emit (node:events:549:35)
    at endReadableNT (node:internal/streams/readable:1359:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
^C2024-07-02 10:27:34,660 INFO 27946 [master] master is killed by signal SIGINT, closing
2024-07-02 10:27:34,661 INFO 27946 [master] system memory: total 1770921984, free 824823808
2024-07-02 10:27:34,661 INFO 27946 [master] process info: heap_limit 910688256, heap_used 43204448
2024-07-02 10:27:34,661 INFO 27946 [master] send kill SIGTERM to app workers, will exit with code:0 after 5000ms



// 执行这个
sudo yum install -y nss nss-util nss-tools nspr libdrm libgbm
```

## 端口占用

```shell
# 端口占用，关闭端口占用的应用

Chrome (115.0.5790.98) downloaded to /root/.cache/puppeteer/chrome/linux-115.0.5790.98
{ initChromeIs: false }

  Puppeteer old Headless deprecation warning:
    In the near feature `headless: true` will default to the new Headless mode
    for Chrome instead of the old Headless implementation. For more
    information, please see https://developer.chrome.com/articles/new-headless/.
    Consider opting in early by passing `headless: "new"` to `puppeteer.launch()`
    If you encounter any bugs, please report them to https://github.com/puppeteer/puppeteer/issues/new/choose.

2024-07-31 16:32:33,625 ERROR 18860 [app_worker] server got error: bind EADDRINUSE 0.0.0.0:19898, code: EADDRINUSE
2024-07-31 16:32:33,639 INFO 18860 [app_worker] receive signal SIGTERM, exiting with code:0
2024-07-31 16:32:33,643 INFO 18860 [app_worker] beforeExit success
2024-07-31 16:32:33,643 INFO 18860 [app_worker] exit with code:0
[2024-07-31 16:32:33.671] [cfork:master:18843] worker:18860 disconnect (exitedAfterDisconnect: false, state: disconnected, isDead: false, worker.disableRefork: true)
[2024-07-31 16:32:33.672] [cfork:master:18843] don't fork, because worker:18860 will be kill soon
2024-07-31 16:32:33,673 INFO 18843 [master] app_worker#2:18860 disconnect, suicide: false, state: disconnected, current workers: ["1","2"]
[2024-07-31 16:32:33.674] [cfork:master:18843] worker:18860 exit (code: 0, exitedAfterDisconnect: false, state: dead, isDead: true, isExpected: false, worker.disableRefork: true)
2024-07-31 16:32:33,675 ERROR 18843 nodejs.AppWorkerDiedError: [master] app_worker#2:18860 died (code: undefined, signal: null, suicide: false, state: dead), current workers: [18859,18860]
    at Master.onAppExit (/snapshot/myprint-server/node_modules/egg-cluster/lib/master.js:410:21)
    at Master.emit (node:events:537:28)
    at Messenger.sendToMaster (/snapshot/myprint-server/node_modules/egg-cluster/lib/utils/messenger.js:137:17)
    at Messenger.send (/snapshot/myprint-server/node_modules/egg-cluster/lib/utils/messenger.js:102:12)
    at EventEmitter.<anonymous> (/snapshot/myprint-server/node_modules/egg-cluster/lib/utils/mode/impl/process/app.js:114:22)
    at EventEmitter.emit (node:events:549:35)
    at ChildProcess.<anonymous> (node:internal/cluster/primary:203:13)
    at Object.onceWrapper (node:events:652:26)
    at ChildProcess.emit (node:events:537:28)
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
name: "AppWorkerDiedError"
pid: 18843



```
