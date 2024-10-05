import { App } from 'vue-demi';
import 'vue3-colorpicker/style.css';

import { mittKey } from './constants/keys';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Vue3ColorPicker from 'vue3-colorpicker';
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css';
// import i18n from "./locales";
import { useSocket } from './stores/socket';
import { mitt } from './utils/utils';
import { useConfigStore } from './stores/config';
import { installPrinter } from './printer';
import { initDisplayRatio } from './utils/devicePixelRatio';
import { installMessage } from './components/my/message/my-message';

const install = {
    install(app: App<any>): any {
        // 插件逻辑
        // comps.map((component:any)=>{
        //     Vue.component(component.__name as string, component);
        // })
        // console.log('~~~MyPrint 初始化~~~');
        // console.log(app)

        if (app.config.globalProperties.$pinia) {
            // Pinia 插件已安装
        } else {
            const pinia = createPinia();
            pinia.use(piniaPluginPersistedstate);
            // @ts-ignore
            app.use(pinia);
        }
        app
            // .use(i18n)
            .use(VueCropper)
            // @ts-ignore
            .use(Vue3ColorPicker);
        app.provide(mittKey, mitt);
        useSocket().INIT_SOCKET();
        useConfigStore().initConfig();

        installPrinter(app);
        installMessage(app);

        initDisplayRatio();

        const container = document.createElement('div');
        container.classList.add('my-popover_container');
        document.body.appendChild(container);
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
