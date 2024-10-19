<template>
    <router-link to="/dashboard" class="logo">
        <img src="@/assets/logo.png" alt="" class="logo-img">
        <span class="logo-title">vue-admin</span>
    </router-link>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.logo{
    width: 100%;
    height: $navbar-height;
    background-color: $sidebar-logo-background;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .logo-img{
        width: 20px;
        height: 20px;
    }
    .logo-title{
        font-size: 16px;
        font-weight: bolder;
        margin-left: 10px;
        line-height: $navbar-height;
        color: #fff;
    }
}

</style>