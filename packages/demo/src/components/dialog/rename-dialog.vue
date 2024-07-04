<template>
    <el-dialog
        :modelValue="modelValue"
        @update:model-value="updateModelValue"
        title="重命名"
        append-to-body
        width="500"
        @opened="renameOpened"
        @closed="handleRenameClose">
        <el-input ref="renameModuleNameRef"
                  v-model="data.renameModuleName"></el-input>
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
import { reactive, ref, watch } from 'vue';

const emit = defineEmits(['update:modelValue', 'confirm']);

const renameModuleNameRef = ref();

const props = withDefaults(defineProps<{
    node?: any,
    modelValue: boolean
    nameValue: string
}>(), {
    node: () => ({})
});

watch(() => props.nameValue, (_o, _n) => {
    data.renameModuleName = props.nameValue;
});

const data = reactive({
    renameModuleName: null
});

function clickRenameClose() {
    updateModelValue(false);
}

function clickRenameSure() {
    emit('confirm', data.renameModuleName);
}

function handleRenameClose() {
    // data.renameModuleName = null;
}

function renameOpened() {
    // console.log(renameModuleNameRef.value);
    renameModuleNameRef.value.select();
}

function updateModelValue(val: Boolean) {
    emit('update:modelValue', val);
}
</script>
