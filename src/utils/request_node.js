import axios from "axios";
import { ElLoading } from "element-plus";
import Message from './message'
const instance = axios.create({
    baseURL:"http://localhost:8080",
    timeout:50 * 1000,
})
// let loading = null;
// instance.interceptors.request.use((config)=>{
//     //加载
//     loading = ElLoading.service({
//         text:"加载中",
//         background:"rgba(0,0,0,0.7)",
//     })
//     return config;
// },(error)=>{
//     Message.error("请求失败:"+error);
//     return Promise.reject(error);
// })
//响应拦截器
instance.interceptors.response.use((response)=>{
    // if(loading){
    //     loading.close();
    // }
    
    const {code, msg} = response.data;
    //请求成功后端返回的响应码
    // if(code==="00000"){
        return response.data;
    // };
},(error)=>{
    console.log(error)
    if(loading){
        loading.close();
    }
    
    if(error.response.data){
        const {code, msg} = error.response.data;
        //token过期或无效，重新登录     
            Message.error(msg);
    }
    
    return Promise.reject(error);
})

export default instance