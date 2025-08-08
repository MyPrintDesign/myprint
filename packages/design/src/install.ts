import { App } from 'vue-demi';
import 'vue3-colorpicker/style.css';
import { mittKey } from './constants/keys';
import Vue3ColorPicker from 'vue3-colorpicker';
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css';
// import i18n from "./locales";
import { mitt } from './utils/utils';
import { installPrinter, myPrintOptions } from './printer';
import { initDisplayRatio } from './utils/devicePixelRatio';
import { installMessage } from './components/my/message/my-message';
import { setupStore } from './stores'
import { useSocketWithOut } from './stores/socket';
import { useConfigStoreWithOut } from './stores/config';


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
            setupStore(app)
        }
        app
            // .use(i18n)
            .use(VueCropper)
            // @ts-ignore
            .use(Vue3ColorPicker);
        app.provide(mittKey, mitt);
        
        // 确保store初始化完成后再调用
        useConfigStoreWithOut().initConfig();
        
        // 延迟初始化socket，确保store完全设置好
        if (!myPrintOptions.disabledClient) {
            setTimeout(() => {
                useSocketWithOut().INIT_SOCKET();
            }, 0);
        }

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
