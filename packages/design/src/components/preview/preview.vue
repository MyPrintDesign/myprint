<template>
    <div class="my-print-preview-wrap"
         ref="previewWrapRef"
         :style="style">
        <element-view :element="preview" />
        <DataTable v-if="preview!.type === 'DataTable'" :element="preview" />
        <!--    <preview-container v-if="element.type === 'PageHeader'" :element="element"/>-->
        <!--    <preview-container v-if="element.type === 'PageFooter'" :element="element"/>-->
        <my-container v-else-if="preview.type === 'Container'" :element="preview">
            <Preview v-for="(item, index) in preview.previewWrapperList" :preview="item" :key="index" />
        </my-container>
    </div>
</template>

<script setup lang="ts">

import { computed, CSSProperties } from 'vue'
import ElementView from '@myprint/design/components/design/element.vue'
import { PreviewWrapper } from '@myprint/design/types/entity'
import { valueUnit } from '@myprint/design/utils/elementUtil'
import DataTable from '@myprint/design/components/design/data-table/data-table.vue'
import { MyContainer } from '@myprint/design/components/design/container'

const style = computed(() => {
    const _style = {
        width: valueUnit(props.preview.width),
        left: valueUnit(props.preview.x),
        top: valueUnit(props.preview.y),
        zIndex: props.preview.runtimeOption.index
    } as CSSProperties
    if (props.preview.heightIs) {
        _style.height = valueUnit(props.preview.height)
    }
    // console.log('change', element.value.previewRuntimeOption.heightIs)
    // _style.transform = getTranslate(element.value!)
    return _style
})
const props = withDefaults(defineProps<{
    preview: PreviewWrapper
}>(), {
    preview: () => ({} as PreviewWrapper)
})
// console.log(props.preview)

// const element = computed(() => props.preview.element)

</script>
