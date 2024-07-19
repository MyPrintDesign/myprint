<template>
    <div class="my-print-preview-wrap"
         ref="previewWrapRef"
         :style="style">
        <element-view :element="preview" />
        <DataTable v-if="preview.type === 'DataTable'" :element="preview" />
        <my-container v-else-if="preview.type === 'PageHeader'">
            <Preview v-for="(item, index) in preview.previewWrapperList" :preview="item" :key="index" />
        </my-container>
        <my-container v-else-if="preview.type === 'PageFooter'">
            <Preview v-for="(item, index) in preview.previewWrapperList" :preview="item" :key="index" />
        </my-container>
        <my-container v-else-if="preview.type === 'Container'">
            <Preview v-for="(item, index) in preview.previewWrapperList" :preview="item" :key="index" />
        </my-container>
    </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, onMounted, onUnmounted, ref } from 'vue-demi';
import ElementView from '@myprint/design/components/design/element.vue';
import { PreviewWrapper } from '@myprint/design/types/entity';
import { getRecursionParentPanel, valueUnit } from '@myprint/design/utils/elementUtil';
import DataTable from '@myprint/design/components/design/data-table/data-table.vue';
import { MyContainer } from '@myprint/design/components/design/container';

const style = computed(() => {
    const _style = {
        width: valueUnit(props.preview.width, getRecursionParentPanel(props.preview)),
        left: valueUnit(props.preview.x, getRecursionParentPanel(props.preview)),
        top: valueUnit(props.preview.y, getRecursionParentPanel(props.preview)),
        zIndex: props.preview.runtimeOption.index
    } as CSSProperties;
    if (props.preview.option.rotate != null) {
        _style.transform = `rotate(${props.preview.option.rotate}deg)`;
    }
    if (props.preview.heightIs) {
        _style.height = valueUnit(props.preview.height, getRecursionParentPanel(props.preview));
    }
    return _style;
});
const props = withDefaults(defineProps<{
    preview: PreviewWrapper
}>(), {
    preview: () => ({} as PreviewWrapper)
});
const previewWrapRef = ref();

onMounted(() => {
    props.preview.target = previewWrapRef.value;
});

onUnmounted(() => {
    props.preview.target = undefined;
});

</script>
