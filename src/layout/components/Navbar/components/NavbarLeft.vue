<template>
    <div class="navbar-left-container">
        <el-breadcrumb separator="/">
            <transition-group name="list">
                <el-breadcrumb-item v-for="bread in breads" :key="bread.path"><router-link :to="bread.path">{{ bread.title
                }}</router-link></el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

//面包屑数据（除首页）
const breads = ref([]);
/**
 * 获取面包屑数据
 */
const getBreadItem = () => {
    breads.value = [];
    breads.value.push({
        title:"首页",
        path:'/'
    })
    if (route.path === "/dashboard") {
        //首页
        return;
    }
    const matcheds = route.matched;
    matcheds.forEach((matched) => {
        const { title } = matched.meta;
        const path = matched.path;
        breads.value.push({ title, path });
    })
}
watch(() => route,
    (nVal, oVal) => {
        getBreadItem();
    },
    {
        deep: true,
        immediate: true,
    }
)
</script>

<style lang="scss" scoped>
.navbar-left-container{
    .el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
.router-link-exact-active {
    color: #9cA3AF !important;  
}
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>