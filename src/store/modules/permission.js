import { defineStore } from "pinia";
import {constantRoutes} from "@/router";
import { getRoutesApi } from "../../api/menu";
import { ref } from "vue";
import Layout from '@/layout/index.vue'
const modules = import.meta.glob("../../views/**/**.vue");
// console.log(modules);
/**
 * 
 * @param {*} roles 角色集合
 * @param {*} routes 路由
 * @returns 角色是否有该路由权限
 */

const hasPermission = (roles,route)=>{
    if(roles.includes('ROOT')){
        return true;
    }
    if(route.meta&&route.meta.roles){
        return roles.some((role)=>{
           return route.meta.roles.includes(role);
        })
    }
    return false;

}
/**
 * 
 * @param {*} roles 
 * @param {*} routes 
 * @returns 
 */
const filterAsyncRoutes = (roles,routes)=>{
    const asyncRoutes = [];
    routes.forEach((route)=>{
        //拷贝route
        const tmpRoute = {...route};
        if(hasPermission(roles,tmpRoute)){
            //Layout
            if(tmpRoute.component?.toString()=='Layout'){
                tmpRoute.component = Layout;
            }else{
                const component = modules[`../../views/${tmpRoute.component}.vue`];
                // const component = ()=>import(`../../views/${tmpRoute.component}/index.vue`);
                if(component){
                    tmpRoute.component = component;
                }else{
                    // tmpRoute.component = import('@/views/errorPages/404.vue');
                    tmpRoute.component = modules['../../views/errorPages/404.vue'];

                }
            }
            if(tmpRoute.children){
                //有子路由，递归
                tmpRoute.children = filterAsyncRoutes(roles, tmpRoute.children);
            }
            asyncRoutes.push(tmpRoute);
        }
    })
    return asyncRoutes;
}
export const usePermissionStore = defineStore("permission",()=>{
    //state
    const routes = ref([]);
    //action
    const setRoutes = (asyncRoutes)=>{
        routes.value = constantRoutes.concat(...asyncRoutes);
    }
    const generateRoutes = (roles)=>{
        return new Promise((resolve,reject)=>{
            getRoutesApi()
            .then(({data:routes})=>{
                //拿到所有当前roles有访问权限的路由
                const asyncRoutes = filterAsyncRoutes(roles,routes);
                setRoutes(asyncRoutes);
                resolve(asyncRoutes);
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }
    return{
        routes,
        generateRoutes,
    }
})