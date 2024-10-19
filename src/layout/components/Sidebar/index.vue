<template>
    <div class="sidebar-container">
        <SidebarLogo></SidebarLogo>
        <el-scrollbar class="menu-panel">
            <SidebarMenu :menuList="menuList" ></SidebarMenu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import SidebarLogo from './components/SidebarLogo.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import {ref } from "vue"
import { usePermissionStore } from '@/store';
const permissionStore = usePermissionStore();
const menuList = ref(permissionStore.routes);
</script>

<style lang="scss" scoped>
.sidebar-container{
    overflow-y: hidden;
    position: fixed;
    left: 0;
    top: 0;
    height:100%;
    width: $sidebar-width;
    .menu-panel{
        height: calc(100vh - $navbar-height);
        background-color: $menu-background;
    }
}
</style>