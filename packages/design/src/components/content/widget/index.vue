<template>
    <div class="option-container display-flex-column">
        <div class="header display-flex">
<!--            <my-icon size="25" v-if="showBackButton" class="header-back-icon">-->
<!--                <ArrowLeft @click="back" />-->
<!--            </my-icon>-->
            <div style="flex: 1;"> {{ moduleName }}</div>
        </div>
        <div class="option-container display-flex-column">
            <my-scrollbar>
                
                <my-widget-collapse :title="i18n('common.business.widget')"
                                    v-if="provider.elementList !=null && provider.elementList.length> 0">
                    <div class="display-flex display-flex-wrap" style="gap: 5px">
                        <business v-for="(element, index) in provider.elementList" :key="index" :data="element"
                                  :pageUnit="provider.pageUnit" />
                    </div>
                </my-widget-collapse>
                <my-widget-collapse :title="i18n('common.common.widget')">
                    <div class="display-flex" style="flex-wrap: wrap;">
                        <basic v-for="(element, index) in customProvider.elementList" :key="index" :data="element"
                               :pageUnit="customProvider.pageUnit" />
                    </div>
                    
                    <!--                    <el-collapse-item title="设计辅助" name="3" v-if="auxiliaryProvider.length> 0">-->
                    <!--                        <div class="display-flex" style="flex-wrap: wrap;">-->
                    <!--                            <basic v-for="(element, index) in auxiliaryProvider" :key="index" :data="element" />-->
                    <!--                        </div>-->
                    <!--                    </el-collapse-item>-->
                </my-widget-collapse>
            </my-scrollbar>
        
        </div>
        <div class="option-bottom">
            <!--      <img class="my-logo" src="../../../assets/myprint-logo.png" alt="my-logo"/>-->
            <div class="my-version">v1.0.0</div>
        </div>
    
    </div>

</template>

<script setup lang="ts">
import business from './business.vue';
import basic from './basic.vue';
import { customProvider } from '../../../constants/provider/custom';
import MyScrollbar from '../../../components/my/scrollbar/my-scrollbar.vue';
import MyWidgetCollapse from '../../../components/my/collapse/my-widget-collapse.vue';
import { i18n } from '../../../locales';
import { getProvider } from '../../../utils/elementUtil';

const $emit = defineEmits(['back']);
const provider = getProvider()
withDefaults(defineProps<{
    moduleName?: string
    showBackButton?: boolean
}>(), {
    moduleName: i18n('common.default.name'),
    showBackButton: true
});

function back() {
    $emit('back');
}
</script>
