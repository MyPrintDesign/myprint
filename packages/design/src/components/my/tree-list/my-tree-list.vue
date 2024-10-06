<template>
    <div class="my-tree-list">
        <div class="my-tree-list-item_wrapper" v-for="(item, index) in list" :key="index">
            <div class="my-tree-list-item">
                <my-switch
                    :nullActive="nullActive"
                    v-model="item.option.enable"
                    @change="parentChange(item)"
                    class="ml-2" />
                <div>{{ item.label }}</div>
            </div>
            <div class="my-tree-list-child"
                 v-if="item.runtimeOption.nestColumnList != null && item.runtimeOption.nestColumnList.length > 0">
                <my-tree-list :nullActive="nullActive" @change="childChange(item)"
                              :list="item.runtimeOption.nestColumnList" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';

const emit = defineEmits(['change']);

withDefaults(defineProps<{
        list?: any[],
        nullActive?: boolean,
    }>(),
    {
        list: () => [],
        nullActive: false
    });

function parentChange(item: any) {
    setColumnList(item, item.option.enable);
    if (item.option.enable == 1 && item.runtimeOption.nestColumnList) {
        for (let nestColumnListElement of item.runtimeOption.nestColumnList) {
            nestColumnListElement.option.enable = 1;
        }
    }
    emit('change');
}

function setColumnList(item: any, val: number) {
    if (item.runtimeOption.nestColumnList == null) {
        return;
    }
    for (let nestColumnListElement of item.runtimeOption.nestColumnList) {
        nestColumnListElement.option.enable = val;
        setColumnList(nestColumnListElement, val);
    }
}

function childChange(item: any) {
    let disableAllIs = true;
    for (let nestColumnListElement of item.runtimeOption.nestColumnList) {
        if (nestColumnListElement.option.enable != 0) {
            disableAllIs = false;
        }
    }
    if (disableAllIs) {
        item.option.enable = 0;
    } else {
        item.option.enable = 1;
    }
    emit('change');
}
</script>
