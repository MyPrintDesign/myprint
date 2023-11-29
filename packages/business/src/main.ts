import {createApp} from 'vue'
import '@cp-print/design/styles/index.scss'

import {mittKey} from "@/constants/keys";
import router from './router'
import App from './App.vue'
import mitt from 'mitt'
import {createPinia} from "pinia";
import piniaPersist from 'pinia-plugin-persist';
// import i18n from "@/locales";
import {createPrint} from '@cp-print/design/index'
import 'element-plus/dist/index.css'
const pinia = createPinia()
pinia.use(piniaPersist)
const app = createApp(App)
app.use(pinia)

// import ElementPlus from 'element-plus'
// app.use(ElementPlus)

app.use(createPrint)
app.provide(mittKey, mitt())

app
    .use(router)
    .mount('#app');


