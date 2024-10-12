# 在docker中部署
::: danger 注意
pdf服务端是用来作为后台服务下载`pdf`或者`图片`的，不是demo的后端服务
:::
## 启动服务

```shell
docker run -d -p 19898:19898 registry.cn-hangzhou.aliyuncs.com/css_public/myprint:1.0.2

#查看日志
docker logs $(docker ps | grep css_public/myprint | awk '{print $1}')

#进入容器
docker exec -it $(docker ps | grep css_public/myprint | awk '{print $1}') /bin/bash
```

## 请求测试

```shell
curl --request POST \
--output out.pdf \
  --url http://192.168.1.10:19898/print/generatePdf \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: PostmanRuntime-ApipostRuntime/1.1.0' \
  --data '{
    "cmd": "print",
    "content": "<div><div>中文sdf123 - myprint</div></div>",
    "height": 297,
    "width": 210
}'

# 成功会返回一个 out.pdf文件

```

## 手动构建镜像

### 代码仓库

[`github`](https://github.com/MyPrintDesign/myprint-docker) [`gitee`](https://gitee.com/MyPrintDesign/myprint-docker)

### 构建镜像 {#build-at-docker}
```shell
#在项目根目录执行
docker build -t myprint-docker .
```
