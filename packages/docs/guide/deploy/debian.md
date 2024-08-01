# 安装

在Debian中部署

## 下载

[下载地址](https://file.myprint.top/myprint-server.tar.gz)

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
sh init-debian.sh
# 如果是 ubuntu ，并且上面的报错，执行这个，如果没报错，就跳过
sh init-ubuntu.sh

# 启动服务
sh start-debian.sh

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
sh stop-debian.sh


# 测试服务
9、测试服务
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
```

##

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
sudo apt install libnss3 libnss3-tools libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2
# 理论上上面执行完，再执行检查 
ldd /root/.cache/puppeteer/chrome/linux-115.0.5790.98/chrome-linux64/chrome | grep not 
# 这个命令就不会有错误了
```
