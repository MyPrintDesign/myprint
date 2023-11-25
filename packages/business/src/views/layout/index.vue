<template>
  <el-container>
    <el-header>
      <header :isCollapse="state.isCollapse" @changeIsCollapse="changeIsCollapse"/>  <!-- header 头部 -->
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
import {reactive} from 'vue';
import header from "@/views/layout/header.vue";

const state = reactive({
  isCollapse: false  // 控制菜单展开 收起
})

const changeIsCollapse = (): void => {
  state.isCollapse = !state.isCollapse
}
</script>
<style>
.el-container {
  height: 100%;
}

.el-main {
  padding: 0;
}
</style>
