# 安装

---

# 前置准备

## npm 安装

推荐使用 npm 的方式安装，它能更好地和 webpack 打包工具配合使用。

::: code-group

```sh [npm]
npm install myprint-design
```

```sh [yarn]
yarn add -D myprint-design
```

:::

## 直接引用 {#my-anchor}

[下载地址](https://code.visualstudio.com/)

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

