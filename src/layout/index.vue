<template>
        <div class="conntainer">
         <Sidebar></Sidebar>
       <div class="container-right">
        <Navbar></Navbar>
        <Tags></Tags>
        <Main></Main>
       </div>
        </div>
        
</template>

<script setup>
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar/index.vue'
import Tags from './components/Tags/index.vue'
import Main from './components/Main/index.vue'
</script>

<style lang="scss" scoped>
.conntainer{
        height: 100%;
        padding-left: $sidebar-width;
        display: flex;
        .container-right{
                width: 100%;
        }
}
</style>