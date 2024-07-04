<template>
    <el-dialog
        :modelValue="modelValue"
        @update:model-value="updateModelValue"
        title="删除"
        width="500"
        append-to-body
        @closed="handleRenameClose">
        是否删除<span style="color: red">&lt;{{ name }}&gt;</span>?
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="clickRenameClose">取消</el-button>
                <el-button type="primary" @click="clickRenameSure">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">

const emit = defineEmits(['update:modelValue', 'confirm']);

const props = withDefaults(defineProps<{
    modelValue: boolean
    name: string
}>(), {});

function clickRenameSure() {
    emit('confirm');
}

function clickRenameClose() {
    updateModelValue(false);
}

function handleRenameClose() {
    // data.renameModuleName = null;
}

function updateModelValue(val: Boolean) {
    emit('update:modelValue', val);
}
</script>
