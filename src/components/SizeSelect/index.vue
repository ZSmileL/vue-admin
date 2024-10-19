<template>
    <!-- 布局大小选择器 -->
        <el-dropdown trigger="click"  @command="">
            <div>
                <SvgIcon :iconClass="'size'">
            </SvgIcon>
            </div>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item disabled>
                    默认
                </el-dropdown-item>
                <el-dropdown-item>
                    大型
                </el-dropdown-item>
                <el-dropdown-item>
                    小型
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
            </el-dropdown>

</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>