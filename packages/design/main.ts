import { createApp } from 'vue';
import Example from './example.vue';

// import './src/styles/index.scss'
// import Vue3ColorPicker from "vue3-colorpicker";

const app = createApp(Example);
// app
//     .use(Vue3ColorPicker)

app.mount(document.querySelector('#app') as HTMLDivElement)

