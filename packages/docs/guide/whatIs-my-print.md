---
outline: deep
---


<span v-for="i in 3">{{ i }}</span>

```vue

<script setup>
    import { ref } from 'vue'
    
    const count = ref(0)
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
    .button {
        color: red;
        font-weight: bold;
    }
</style>

```

**输出**

<div class="escape-demo">

<script setup>
import { ref } from 'vue'
const count = ref(0)
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


