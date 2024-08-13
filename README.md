# MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器

## 说明

* 项目技术栈：`Vue@3.4.31` `TypeScript@5.0.2` `Vite@5.2.6`
* 打印设计面板，设计结果支持打印、生成pdf、生成图片，支持浏览器、客户端、服务端三种生成，并且三种方式生成结果高度统一。
* 支持多级表头数据表格，以及表格数据统计。
* 支持svg、手画板。
* 操作简单，内置快捷键：Ctrl+c、Ctrl+v快速复制粘贴、Ctrl+s保存、Ctrl+z回滚、Ctrl+y重做、方向键微调位置。
* 多种安装方式支持`centos`、`debian`、`docker`、`k8s` 一键安装

## 有图有真相


## 如何使用

### npm 安装

```sh [npm]
npm install myprint-design
```

```sh [yarn]
yarn add -D myprint-design
```

### 直接引用(仅支持ts) {#my-anchor}

> 下载本项目(参考package/demo)

#### 如何引用？

```
.
├─ packages
│  ├─ demo
│  ├─ design
└─ └─ docs

复制design代码 到对应项目目录下

配置 vite.config.ts

#vite.config.ts
export default defineConfig({
    ...
    resolve: {
        alias: {
            'myprint-design': fileURLToPath(new URL('../design/src', import.meta.url))
        }
    }
});
```


## 配套服务

### 客户端（本地调用打印机进行打印）[`去下载`](.)


> 本地客户端支持局域网连接，可以做到同一局域网内别的机器的浏览器提交任务，由同一个打印机进行打印


### 服务端（服务端生成pdf）[`去下载`](https://myprint.top/myprint-server.zip)

> 在服务器生成pdf或者图片

## 支持的控件

### 普通控件

| 名称   | 说明                         |
|------|----------------------------|
| 文本框  | 文本框                        |
| 时间控件 | 时间控件，打印时间                  |
| 图片   | 支持选择本地图片、裁剪                |
| 数据表格 | 一个支持多级表头，表头排序、缩放、数据统计的数据表格 |
| 横实线  | —                          |
| 竖实线  | —                          |
| 横虚线  | 虚线，支持修改虚线类型                |
| 竖虚线  | 虚线，支持修改虚线类型                |
| 容器   | 容器内可放置元素                   |
| 页眉   | 页眉                         |
| 页脚   | 页脚                         |
| 页码   | 页码                         |

### SVG控件

| 名称      | 说明           |
|---------|--------------|
| 直线      | 随意角度的直线      |
| 一阶贝塞尔曲线 | 一条一阶贝塞尔曲线    |
| 二阶贝塞尔曲线 | 一条二阶贝塞尔曲线    |
| 手画板     | 手画板          |
| 椭圆      | 椭圆           |
| 圆       | 圆            |
| 多边形     | 多边形，支持增加、删除边 |

## 本地启动

### 安装依赖

```sh
# 使用 pnpm 来管理项目
pnpm i
```

### 启动项目

```sh
npm run dev
```

### 打包

```sh
npm run build:design
```

## 交流群

