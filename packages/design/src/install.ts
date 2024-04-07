import { App, ref } from 'vue';

import 'vue3-colorpicker/style.css';

import { messageFun, mittKey } from './constants/keys';


import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// @ts-ignore
// import piniaPersist from 'pinia-plugin-persist';
import Vue3ColorPicker from 'vue3-colorpicker';
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css';
// import i18n from "./locales";
import { useSocket } from './stores/socket';
import { mitt } from '@myprint/design/utils/utils';
import { useConfigStore } from '@myprint/design/stores/config';
// import 'element-plus/es/components/button/style/index'
// import 'element-plus/es/components/scrollbar/style/index'
// import 'element-plus/es/components/switch/style/index'
// import 'element-plus/es/components/input/style/index'
// import 'element-plus/es/components/form/style/index'
// import 'element-plus/es/components/form-item/style/index'
// import 'element-plus/es/components/select/style/index'
// import 'element-plus/dist/index.css'

// import {ElButton, ElSelect, ElOption, ElIcon, ElScrollbar, ElPopover,ElTooltip,ElInput,ElInputNumber,
//     ElContainer, ElAside, ElMain, ElRow,ElCol,ElForm,ElFormItem,ElDivider,ElSwitch} from 'element-plus'
const onSocketMessage = ref<Function>();

const install = {
    install(app: App<any>): any {
        // 插件逻辑
        // comps.map((component:any)=>{
        //     Vue.component(component.__name as string, component);
        // })
        console.log('~~~MyPrint 初始化~~~');
        // console.log(app)

        if (app.config.globalProperties.$pinia) {
            // Pinia 插件已安装
        } else {
            const pinia = createPinia();
            pinia.use(piniaPluginPersistedstate);
            app.use(pinia);
        }
        app
            // .use(ElButton)
            // .use(ElSelect)
            // .use(ElOption)
            // .use(ElIcon)
            // .use(ElScrollbar)
            // .use(ElPopover)
            // .use(ElTooltip)
            // .use(ElInput)
            // .use(ElInputNumber)
            // .use(ElContainer)
            // .use(ElAside)
            // .use(ElMain)
            // .use(ElRow)
            // .use(ElCol)
            // .use(ElForm)
            // .use(ElFormItem)
            // .use(ElDivider)
            // .use(ElSwitch)
            // .use(i18n)
            .use(VueCropper)
            .use(Vue3ColorPicker);
        app.provide(messageFun, onSocketMessage);
        //@ts-ignore
        app.provide(mittKey, mitt);

        useSocket().INIT_SOCKET(onSocketMessage);

        useConfigStore().initConfig()
    }
};
export { install };


// export * from './index'
// function loadFonts() {


// let style = document.createElement('style');
// style.type = "text/css";
// let text = ` @font-face {
//               font-family:'AlimamaShuHeiTi-Bold';
//               src:url('./src/assets/fonts/AlimamaShuHeiTi-Bold.ttf')
//               }`
// console.log(text)
// style.innerText = text;
// document.head.appendChild(style)


// const fontStyles = document.createElement('link');
// fontStyles.href = '/fonts.css';
// fontStyles.rel = 'stylesheet';
// document.head.appendChild(fontStyles);
// }
