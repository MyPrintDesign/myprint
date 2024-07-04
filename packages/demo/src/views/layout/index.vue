<template>
    <el-container class="demo-container">
        <el-header>
            <el-menu
                ref="menuRef"
                :default-active="activeIndex"
                class="el-menu-demo"
                :hide-timeout="0"
                :show-timeout ="0"
                mode="horizontal"
                menu-trigger="none"
                :teleported="false"
                :collapse-transition="false"
                :popper-offset="-1000"
                @select="handleSelect">
                <!--                <el-menu-item index="/module">个人模版</el-menu-item>-->
                <!--                <el-menu-item index="/templateCenter">模版中心</el-menu-item>-->
                <!--                <el-menu-item index="/open-source">开源中心</el-menu-item>-->
                <!--                <el-menu-item index="/doc">文档</el-menu-item>-->
                <el-menu-item index="/module">--</el-menu-item>
                <el-menu-item index="/templateCenter">--</el-menu-item>
                <el-menu-item index="/open-source">--</el-menu-item>
                <el-menu-item index="/doc">--</el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="padding: 0px !important;">
            <router-view v-slot="{ Component }">
                <keep-alive :include="useKeepAliveStore.keepAliveComponents" :max="20">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </el-main>
    </el-container>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import router from '@/router';
import { keepAliveStore } from '@/stores/keepAliveStore';

defineOptions({
    name: 'Layout'
});
const activeIndex = ref('/module');
let lastIndex = '/module';
const menuRef = ref();
const useKeepAliveStore = keepAliveStore();

const handleSelect = (key: string, _keyPath: string[]) => {
    activeIndex.value = key;

    if (key === '/open-source') {
        ((((menuRef.value.$el) as HTMLElement).children[2]) as HTMLLIElement).blur();
        // 打开外部链接
        setTimeout(() => {
            activeIndex.value = lastIndex;
        }, 10);

        window.open('https://github.com');
        return;
    }
    router.push({ path: key });
    // return true;
    lastIndex = key;
};

</script>
