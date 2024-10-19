<template>
    <div class="navbar-right-container">
        <!-- 全屏模式 -->
        <div @click="toggle" class="setting-item">
            <SvgIcon :iconClass="isFullscreen ? 'fullscreen-exit' : 'fullscreen'">
            </SvgIcon>
        </div>
        <!-- 布局大小 -->
        <el-tooltip
        class="box-item"
        effect="dark"
        content="布局大小"
        placement="bottom"
      >
       <SizeSelect class="setting-item"></SizeSelect>
        </el-tooltip>
        <!-- 语言 -->
        <LangSelect class="setting-item"></LangSelect>
        <!-- 头像 -->
        <el-dropdown trigger="click" class="setting-item">
            <div class="avatar-panel">
                <img :src=avatar class="avatar-img">
            <span style="font-size: 14px;">{{ nickname }}</span>
        </div>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click=handleLogout>
                    注销登出
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
            </el-dropdown>
        <!-- 设置 -->
        <div class="setting-item">
            <SvgIcon iconClass="setting"></SvgIcon>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store';
import { useFullscreen } from '@vueuse/core'
import { ElMessageBox } from "element-plus";
//全屏
const { isFullscreen, toggle } = useFullscreen();
const userStore = useUserStore();
//用户信息 头像 用户名
const avatar = ref(userStore.user.avatar);
const nickname = ref(userStore.user.nickname);
/**
 * 登出
 */
const handleLogout = ()=>{
    ElMessageBox.confirm(
        "确认登出吗？",
        '提示',
        {
            confirmButtonText:"确认",
            cancelButtonText:"取消",
            type:"warning"
        }
    )
    .then(()=>{
            userStore.logout()
            .then(()=>{
                location.reload();
            });
        })
}

</script>

<style lang="scss" scoped>
.navbar-right-container {
    display: flex;
    text-align: center;

    .setting-item {
        display: inline-block;
        font-size: 16px;
        min-width: 40px;
        height: 100%;
        cursor: pointer;
        line-height: $navbar-height;
        &:hover{
            background-color: #e5e5e5;
        }
    }
    .avatar-panel{
            display: flex;
            align-items: center;
            padding: 0 10px;
            .avatar-img{
                border-radius: 50%;
            width: 24px;
            height: 24px;
            margin-right: 10px; 
        }
        }
}
</style>