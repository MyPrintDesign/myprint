<template>
    <td ref="columnRef"
        v-if="column != undefined"
        class="my-print-columnHead"
        :colspan="column.colspan"
        :rowspan="column.rowspan"
        :style="headStyle">
        <my-text :element="column" />
    </td>
</template>
<script setup lang="ts">

import { computed, CSSProperties, onMounted, ref } from 'vue';
import { TableCellElement } from '@myprint/design/types/entity';
import MyText from '@myprint/design/components/design/text';

const props = withDefaults(defineProps<{
    column?: TableCellElement
}>(), {
    column: () => (undefined! as TableCellElement)
});
const columnRef = ref();

onMounted(() => {
    props.column.runtimeOption.target = columnRef.value;
});

const headStyle = computed(() => {
    if (props.column == null) {
        return;
    }
    const style = {
        //       nowrap="nowrap"
        maxWidth: props.column.runtimeOption.width + 'px',
        width: props.column.runtimeOption.width + 'px',
        height: props.column.runtimeOption.init.height + 'px',
        maxHeight: props.column.runtimeOption.init.height + 'px'
    } as CSSProperties;
    
    if (props.column.option.borderAll) {
        style['border'] = '1px solid var(--tcolor)';
    } else {
        // style['border'] = '1px solid transparent';
    }
    if (props.column.contentType == 'QrCode' || props.column.type == 'Image') {
        style.lineHeight = 0;
    }
    return style;
});

</script>
//outline: 1px solid black; border: 1px solid #000;

//outline: 1px solid black; border: 1px solid #000;

