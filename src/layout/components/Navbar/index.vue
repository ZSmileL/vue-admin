<template>
    <div class="navbar-container">
    <NavbarLeft></NavbarLeft>
    <NavbarRight></NavbarRight>
    </div>
</template>

<script setup>
import NavbarLeft from './components/NavbarLeft.vue'
import NavbarRight from './components/NavbarRight.vue';
</script>

<style lang="scss" scoped>
.navbar-container{
    display: flex;
    justify-content: space-between;
    height: $navbar-height;
    align-items: center;
    width: 100%;
    background-color: #fff;
    padding-left: 50px;
    border-bottom: #ccc 1px solid;
}
</style>