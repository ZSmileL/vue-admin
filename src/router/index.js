import { createRouter, createWebHashHistory } from "vue-router";
import Layout from '@/layout/index.vue'
//静态路由
export const constantRoutes = [
    {
        path: '/login',
        component: () => import("@/views/login/index.vue"),
        meta: {
            hidden: true,  //是否在侧边栏菜单中隐藏
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: "/dashboard",  //重定向
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: "首页",
                    icon: "homepage",
                    affix: true,    // 是否固定页签 
                    keepAlive: true,    /** 是否缓存页面 */
                    alwaysShow: false,
                },
            },
            {
                path: '404',
                component: () => import('@/views/errorPages/404.vue'),
                meta: {
                    hidden: true,  //是否在侧边栏菜单中隐藏
                }
            }
        ]
    }
]
const router = createRouter({
    routes: constantRoutes,
    history: createWebHashHistory()
})

/**
 * 重置路由
 */
// export function resetRouter(){
//     router.replace("/login");
// }
export default router;