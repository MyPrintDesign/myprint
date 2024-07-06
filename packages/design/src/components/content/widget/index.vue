<template>
    <div class="option-container display-flex-column">
        <div class="header display-flex">
            <el-icon size="25" class="header-back-icon">
                <ArrowLeft @click="back" />
            </el-icon>
            <div style="flex: 1;"> {{ moduleName }}</div>
        </div>
        <div class="option-container display-flex-column">
            <my-scrollbar>
                <el-collapse v-model="openPanel" class="option-collapse">
                    <el-collapse-item title="业务字段" name="1"
                                      v-if="provider.elementList != null && provider.elementList.length > 0">
                        <div class="display-flex display-flex-wrap" style="gap: 5px">
                            <business v-for="(element, index) in provider.elementList" :key="index" :data="element"
                                      :pageUnit="provider.pageUnit" />
                        </div>
                    
                    </el-collapse-item>
                    <el-collapse-item title="公共组件" name="2">
                        <div class="display-flex" style="flex-wrap: wrap;">
                            <basic v-for="(element, index) in customProvider.elementList" :key="index" :data="element"
                                   :pageUnit="customProvider.pageUnit" />
                        </div>
                    </el-collapse-item>
                    
                    <!--                    <el-collapse-item title="设计辅助" name="3" v-if="auxiliaryProvider.length> 0">-->
                    <!--                        <div class="display-flex" style="flex-wrap: wrap;">-->
                    <!--                            <basic v-for="(element, index) in auxiliaryProvider" :key="index" :data="element" />-->
                    <!--                        </div>-->
                    <!--                    </el-collapse-item>-->
                </el-collapse>
            </my-scrollbar>
        
        </div>
        <div class="option-bottom">
            <!--      <img class="my-logo" src="../../../assets/myprint-logo.png" alt="my-logo"/>-->
            <div class="my-version">v1.0.0</div>
        </div>
    
    </div>

</template>

<script setup lang="ts">
// import { ElIcon, ElScrollbar, ElCollapse, ElCollapseItem } from 'element-plus'
import business from './business.vue';
import basic from './basic.vue';
import { inject, ref } from 'vue';
import { providerKey } from '@myprint/design/constants/keys';
import { customProvider } from '@myprint/design/constants/provider/custom';
import { ArrowLeft } from '@element-plus/icons-vue';
import MyScrollbar from '@myprint/design/components/my/scrollbar/my-scrollbar.vue';

const $emit = defineEmits(['back']);

const provider = inject(providerKey)!;
withDefaults(defineProps<{
    moduleName?: string
}>(), {
    moduleName: '默认名称'
});
const openPanel = ref(['1', '2', '3']);

function back() {
    $emit('back');
}
</script>
