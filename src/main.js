import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "@/router/index.js"
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
//国际化，element plus 默认英文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import './assets/icon/iconfont.css'
import 'virtual:svg-icons-register'
import {hasPerm} from '@/directive/permission'
import Message from "@/utils/message.js"
import SvgIcon from '@/components/SvgIcon/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from "@/components/Dialog/index.vue"
import { setupPermission } from './pluggins/permission'
import "@/styles/index.scss"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
setupPermission();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
    locale: zhCn,
  })
app.config.globalProperties.Message = Message;
app.component("SvgIcon",SvgIcon);
app.component("SizeSelect",SizeSelect);
app.component("LangSelect",LangSelect);
app.component("Pagination",Pagination);
app.component("Dialog",Dialog);
app.use(router);
app.use(createPinia());
//全局注册自定义指令hasPerm
app.directive("hasPerm",hasPerm);
app.mount('#app')
