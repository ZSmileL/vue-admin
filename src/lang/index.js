//国际化配置
import { createI18n } from "vue-i18n";
import zhCN from "./packges/zh-CN";
import en from "./packges/en";

const i18N = createI18n({
    messages: {
        'zh-cn': zhCN,
        'en': en
    },
    locale: 'zh-cn',
    legacy: false
})