import { createApp } from 'vue';
import Example from './example.vue';
import './src/index.less';

import './src/styles/style.css'
import '@cp-print/design/styles/var.scss'
import '@cp-print/design/styles/commStyle.scss'

import './styles/iconfont.css'
import './styles/iconfont-color.css'
import '@cp-print/design/styles/font.scss'
import '@cp-print/design/styles/printStyle.scss'
import '@cp-print/design/styles/element-plus-ui-cover.scss'
const app = createApp(Example);

app.mount(document.querySelector('#app') as HTMLDivElement)

