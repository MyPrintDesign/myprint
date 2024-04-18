<template>
    <div class="history-line-wrapper">
        <span class="prefix">{{ data.prefix }}</span>
        <span>{{ data.suffix }}</span>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const props = withDefaults(defineProps<{
    content?: string
}>(), {
    content: ''
});
const data = reactive({
    prefix: '',
    suffix: ''
});
if (props.content) {
    const lastIndex = props.content.lastIndexOf('>');
    data.prefix = props.content.substring(0, lastIndex);
    data.suffix = props.content.substring(lastIndex, props.content.length);
}

</script>
