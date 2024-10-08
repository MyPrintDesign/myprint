# 安装

---

# 前置准备

:::danger :tada: :100:注意:100: :tada:
需要基于vue3的项目引用，其他框架正在努力解决中！！！
:::

## npm 安装

::: code-group

```sh [npm]
npm install myprint-design
```

```sh [yarn]
yarn add -D myprint-design
```

:::

### 浏览器直接引入

直接通过浏览器的 HTML 标签导入 MyPrint，然后就可以使用全局变量 MyPrintDesign 了。

```html
<link rel="stylesheet" href="//jsd.onmicrosoft.cn/npm/myprint-design/css/styles/index.css" />
<!-- Import Vue 3 -->
<script src="//jsd.onmicrosoft.cn/npm/vue@3"></script>
<!-- Import component library -->
<script src="//jsd.onmicrosoft.cn/npm/myprint-design"></script>

```

### 在线示例

通过 CDN 的方式我们可以很容易地使用 MyPrint 写出一个 设计 页面。 [在线演示](https://codepen.io/chushenshen/pen/BagYjLo)


## 直接引用(仅支持ts) {#my-anchor}

[下载地址](https://github.com/MyPrintDesign/myprint)

### 如何引用？

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

