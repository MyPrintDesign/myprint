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

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(pinia);


app.use(ElementPlus, { locale: zhCn });

MyPrinter.setServerUrl(import.meta.env.VITE_API_PDF_SERVER_URL);
app.use(createPrint);

app.provide(mittKey, mitt());

app
    .use(router)
    .mount('#app');


