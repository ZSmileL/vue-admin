import { defineStore } from "pinia";
import {loginApi, logoutApi} from '@/api/auth/index.js'
import { getUserInfoApi } from "@/api/user";
import { ref } from "vue";
// import { resetRouter } from "../../router";
//setup Store
export const useUserStore = defineStore("user",()=>{
    const user = ref({
        perms:[],
        roles:[]
    });
    //登录
    const login = (data)=>{
        return new Promise((resolve,reject)=>{
            loginApi(data)
            .then((response)=>{
                //登录成功,拿到token并存储
                const {accessToken, tokenType} = response.data;
                localStorage.setItem('token',tokenType+" "+accessToken);    // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
                resolve();
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }
    //注销
    const logout = ()=>{
        return new Promise((resolve,reject)=>{
            logoutApi()
            .then(()=>{
                removeToken();
                resolve();
            })
            .catch(error=>{
                reject(error)
            })
            })
    }
    const getUserInfo = ()=>{
        return new Promise((resolve,reject)=>{
            getUserInfoApi()
            .then(({data})=>{
                Object.assign(user.value,data);
                // console.log()
                resolve(data);
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }
    
    //销毁token
    const removeToken = ()=>{
        localStorage.setItem("token","");
        // resetRouter();
    }
    return{
        user,
        login,
        removeToken,
        getUserInfo,
        logout
    }
})