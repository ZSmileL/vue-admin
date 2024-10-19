<template>
    <el-dropdown trigger="click" @command="">
        <SvgIcon iconClass="language"></SvgIcon>
        <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item disabled>
                中文
            </el-dropdown-item>
            <el-dropdown-item >
                English
            </el-dropdown-item>
        </el-dropdown-menu>
    </template>
        </el-dropdown>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>