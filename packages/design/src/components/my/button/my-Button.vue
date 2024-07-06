<template>
    <button aria-disabled="false"
            type="button"
            class="my-button my-button--small">
        <slot />
    </button>
</template>

<script setup lang="ts">
</script>

<style>

.my-button:hover {

    color: var(--el-button-hover-text-color);
    border-color: var(--el-button-hover-border-color);
    background-color: var(--el-button-hover-bg-color);
    outline: 0;
}

.my-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    height: 32px;
    white-space: nowrap;
    cursor: pointer;
    color: var(--el-button-text-color);
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    transition: .1s;
    font-weight: var(--el-button-font-weight);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    -webkit-appearance: none;
    background-color: var(--el-button-bg-color);
    border: var(--el-border);
    border-color: var(--el-button-border-color);
    padding: 8px 15px;
    font-size: var(--el-font-size-base);
    border-radius: var(--el-border-radius-base);
}

.my-button--small {
    height: var(--el-button-size);
    padding: 5px 11px;
    font-size: 12px;
    border-radius: calc(var(--el-border-radius-base) - 1px);
}
</style>
