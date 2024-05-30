<template>
    <el-table-column>
        <recursive-table-column v-if="item.childList != null && item.childList.length > 0" :column-list="item.childList"
                                v-for="(itemInner, index) in item.childList" :item="itemInner"
                                :key="itemInner.prop+'$'+index" :prop="itemInner.prop"
                                :label="itemInner.label">
            <template #default="{scope, item}">
                <slot :scope="scope" :item="item" />
            </template>
        </recursive-table-column>
        <template v-if="item.childList == null || item.childList.length == 0" #default="scope">
            
            <slot :scope="scope" :item="item" />
        
        </template>
    </el-table-column>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
    item: any
}>(), {});
</script>
