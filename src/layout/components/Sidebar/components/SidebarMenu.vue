<template>
    <div class="menu-container">
        <el-menu mode="vertical" text-color="#bfcbd9" active-color="#ffd04b" :default-active="curRoute.path">
            <SidebarMenuItem
        v-for="route in menuList"
        :item="route"
        :isNest="false"
        :path="route.path"
        ></SidebarMenuItem>
        </el-menu>
    </div>
</template>

<script setup>
import SidebarMenuItem from './SidebarMenuItem.vue';
import{ ref } from "vue"
import { useRouter, useRoute } from 'vue-router';
const props = defineProps({
    menuList:{
        required:true,
        type:Array
    }
})
//当前路由
const curRoute = useRoute();
</script>

<style lang="scss" scoped>
.menu-container{
    width: 100%;
    :deep(.el-menu){
        border: none;
    }
}
</style>