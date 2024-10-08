import { createApp } from 'vue';
import '@/styles/var.scss';
import '@/styles/module.scss';
import '@myprint/design/styles/index.scss';
import { createPrint, MyPrinter } from '@myprint/design/index';

import { mittKey } from '@/constants/keys';
import router from './router';
import App from './App.vue';
import mitt from 'mitt';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'element-plus/dist/index.css';
//引入zhCn
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import ElementPlus from 'element-plus';
import { initVisitorId } from '@/utils/util';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(pinia);

app.use(ElementPlus, { locale: zhCn });
initVisitorId();

MyPrinter.initMyPrinter({
    clientUrl: 'ws://127.0.0.1:9898',
    serverUrl: import.meta.env.VITE_API_PDF_SERVER_URL
});

// MyPrinter.setLocale('enUs');
MyPrinter.setLocale('zhCn');

app.use(createPrint);

app.provide(mittKey, mitt());

app
    .use(router)
    .mount('#app');


