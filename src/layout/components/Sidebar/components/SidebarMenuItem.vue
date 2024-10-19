<template>
    <div class="sidebar-item-container" v-if="!item.meta||!item.meta.hidden">
        <!-- 单个路由 -->
      
        <template v-if="hasOnlyShowRoute(item.children,item)&&!onlyShowRoute.children">
            <router-link :to="parsePath(onlyShowRoute )">
        <el-menu-item :index="parsePath(onlyShowRoute )">
            <SvgIcon :iconClass="onlyShowRoute.meta.icon"></SvgIcon>
        {{ onlyShowRoute.meta.title }}
      </el-menu-item>
    </router-link>
      </template>

      <!-- 多个路由 -->
      <el-sub-menu :index="path" v-else>
        <template #title>
        <SvgIcon :iconClass="item.meta.icon"></SvgIcon>
            {{ item.meta.title }}
        </template>
        
        <SidebarMenuItem
        v-for="child in item.children"
        :item="child"
        :isNest="true"
        :path="parsePath(child)"
        ></SidebarMenuItem>
      </el-sub-menu>
      
        
    </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
// import path from "path-browserify";
import {ref, computed} from 'vue'
const props = defineProps({
    //路由
    item:{
        required:true,
        type:Object
    },
    //是否二级菜单
    isNest:{
        required:true,
        type:Boolean
    },
    //父级路径
    path:{
        required:true,
        type:String
    }
})
// console.log(props.path,props.item)
const onlyShowRoute = ref({});
const hasOnlyShowRoute = (children=[],parent)=>{
    const showRoute = children.filter((route)=>{
        if(route.meta.hidden){
            //路由不显示在菜单
            return false;
        }else{
onlyShowRoute.value = route;
        return true
        }
        
    })
    if(showRoute.length===1){
        //只有一个显示的子路由
        return true;
    }
    if(showRoute.length === 0){
        //没有显示的子路由
        //path置为空，表示没有子路由，方便解析路径
        onlyShowRoute.value = {...parent,path:""};
        return true;
    }
    return false;
}
const  parsePath = (route)=>{
    //完整路径：父级路径+路由路径
    if(props.path==="/"){
        return `/${route.path}`
    }else{
        //避免路径为system/user/   希望是system/user
        return route.path?`${props.path}/${route.path}`:props.path;
    }
}
</script>
<style lang="scss" scoped>
.sidebar-item-container{
    width: 100%;
    background-color: $menu-background;
    
    :deep(.el-menu-item:hover,.el-submenu__title:hover){
        
        background-color: #000;
    }
    :deep(.el-sub-menu__title:hover){
            background-color: #000;

        }
}
</style>