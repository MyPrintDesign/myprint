---
outline: deep
---

:::tip :tada: :100:快速体验:100: :tada:
[点击体验](./use-api/design-panel)
:::

## 
vue3+ts+vite开发的打印设计框架
## 支持的控件

### 普通控件

| 名称   | 说明          | 字段 |
|------|-------------|----|
| 文本框  | X86         | —  |
| 时间控件 | 时间控件，打印时间   | —  |
| 图片   | 支持选择本地图片、裁剪 | —  |
| 横实线  | 支持选择本地图片、裁剪 | —  |
| 竖实线  | 支持选择本地图片、裁剪 | —  |
| 页眉   | 支持选择本地图片、裁剪 | —  |
| 页脚   | 支持选择本地图片、裁剪 | —  |
| 页码   | 支持选择本地图片、裁剪 |    |

### SVG控件
| 名称      | 说明          | 字段 |
|---------|-------------|----|
| 直线      | 支持选择本地图片、裁剪 | —  |
| 一阶贝塞尔曲线 | 支持选择本地图片、裁剪 | —  |
| 二阶贝塞尔曲线 | 支持选择本地图片、裁剪 | —  |


**输出**

<div class="escape-demo">

<script setup>
import { ref } from 'vue'
const count = ref(0);
</script>

## Markdown Content

The count is: {{ count }}
<button :class="$style.button" @click="count++">Increment</button>
</div>

<style module>
    .button {
        color: red;
        font-weight: bold;
    }
</style>


<style>
.escape-demo {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 0 20px;
}
</style>


