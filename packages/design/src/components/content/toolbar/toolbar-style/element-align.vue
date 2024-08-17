<template>
    <div class="align-down-list-panel">
        
        <div v-for="(elementAlignChildList, index) in dataList">
            <div class="align-down-list-panel__item"
                 v-for="(elementAlign) in elementAlignChildList"
                 @click="click(elementAlign)">
                
                <my-icon v-if="showSelectedStatus"
                         class="align-down-list-panel__item__select iconfont icon-duihao"
                         :class="{'my-hidden': modelValue != elementAlign.value}">
                </my-icon>
                
                <i class="align-down-list-panel__item__icon" v-if="elementAlign.icon"
                   :class="elementAlign.icon" />
                
                <div class="align-down-list-panel__item__content user-select-none">
                    {{ elementAlign.label }}
                </div>
            </div>
            
            <div v-if="index < dataList.length - 1"
                 class="align-down-list-panel__divider" />
        </div>
    
    </div>
</template>

<script setup lang="ts">
import { DownList } from '../../../../types/entity';
import MyIcon from '../../../../components/my/icon/my-icon.vue';
import { computed } from 'vue-demi';

const emit = defineEmits(['update:modelValue', 'change', 'click']);

const props = withDefaults(defineProps<{
        showSelectedStatus?: boolean,
        modelValue?: any,
        elementAlignList: DownList[][],
    }>(),
    {
        modelValue: null,
        showSelectedStatus: false,
        elementAlignList: () => [] as DownList[][]
    });

const dataList = computed(() => {
    if (!props.elementAlignList || props.elementAlignList.length == 0) {
        return [] as DownList[][];
    }
    if (props.elementAlignList[0] instanceof Array) {
        return props.elementAlignList;
    } else {
        return [props.elementAlignList as any] as DownList[][];
    }
});

function click(elementAlign: DownList) {
    if (elementAlign.click) {
        elementAlign.click();
    } else {
        if (props.modelValue != elementAlign.value) {
            emit('update:modelValue', elementAlign.value);
            emit('change', elementAlign);
        }
    }
}

</script>


