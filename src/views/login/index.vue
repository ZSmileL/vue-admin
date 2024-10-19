<template>
    <div class="containner">
        <!-- 登录表单 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }" class="login-card">
            <div class="text-center login-title">
                <h2>vue3-admin</h2>
            </div>
            <el-form :model="loginForm" ref="loginFormRef" :rules="loginRules" :inline="false" size="normal"
                class="login-form-panel">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="用户名">
                        <template #prefix> <span class="iconfont icon-yonghuming"></span> </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" show-password v-model="loginForm.password" placeholder="密码">
                        <template #prefix> <span class="iconfont icon-mima"></span> </template>
                    </el-input>
                </el-form-item>
                <el-form-item class="login-captcha-panel" prop="captchaCode">
                    <el-input v-model="loginForm.captchaCode" placeholder="验证码" class="login-captcha">
                        <template #prefix> <span class="iconfont icon-yanzhengma"></span> </template>
                    </el-input>
                    <el-image :src="captchaBase64" fit="fill" class="captcha-img" @click="getCaptcha"></el-image>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>

        </el-card>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCaptchaApi } from '@/api/auth'
import { useUserStore } from '@/store/modules/user';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
// userStore
const userStore = useUserStore();
//登录表单
const loginForm = ref({
    username: 'root',
    password: '123456'
});
const loginFormRef = ref();

//表单检验
const loginRules = {
    username: [
        { required: true, message: "用户名不能为空" }
    ],
    password: [
        { required: true, message: "密码不能为空" }
    ],
    captchaCode: [
        { required: true, message: "验证码不能为空" }
    ]
}
//验证码地址
const captchaBase64 = ref('');
/**
 * 获取验证码
 */
const getCaptcha = () => {
    getCaptchaApi().then(({ data }) => {
        captchaBase64.value = data.captchaBase64;
        loginForm.value.captchaKey = data.captchaKey;
    });
}

/**
 * 登录
 */

const handleLogin = () => {
    loginFormRef.value.validate((valid) => {
        if (valid) {
            //表单检验通过
            userStore.login(loginForm.value)
                .then(() => {
                    // userStore.getUserInfo();
                    //拿到路由中的query，它的redirect指明了登录后要跳转到的页面
                    const redirect = route.query.redirect;
                    //拿到除了redirect外的其它query
                    const otherQuery = Object.keys(route.query).reduce((prev, cur) => {
                        if (cur != 'redirect') {
                            prev[cur] = route.query[cur];
                        }
                        return prev;
                    }, {})
                    //跳转页面
                    // console.log({ path: redirect, query: otherQuery })
                    router.push({ path: redirect, query: otherQuery });
                })
                .catch((error) => {
                    getCaptcha();
                })
        }
    })
}

onMounted(() => {
    getCaptcha();
})
</script>

<style lang="scss" scoped>
.containner {
    background: url('@/assets/images/login-bg.jpg') no-repeat center right;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .login-card {
        padding: 20px;
        border-radius: 4%;

        .login-title {
            margin-bottom: 50px;
            font-size: 1rem;
        }

        :deep(.el-form-item) {
            margin-top: 20px;

            .el-input__wrapper {
                height: 3rem;
                outline: none;
            }
        }

        .login-captcha-panel {
            display: flex;
            width: 100%;

            .login-captcha {

                flex: 1;

            }

            .captcha-img {
                width: 40%;
                cursor: pointer;
            }
        }

        .login-btn {
            width: 100%;
        }
    }
}</style>