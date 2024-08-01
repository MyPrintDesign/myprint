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

