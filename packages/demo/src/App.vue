<template>
    <el-config-provider>
        <router-view v-slot="{ Component }">
            <keep-alive :include="useKeepAliveStore.keepAliveComponents" :max="20">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </el-config-provider>
</template>
<script setup lang="ts">
import { keepAliveStore } from '@/stores/keepAliveStore';

const useKeepAliveStore = keepAliveStore();

</script>
