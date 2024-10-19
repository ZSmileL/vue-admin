import request from '@/utils/request'

/**
 * 登录
 * @param {*} data 
 * @returns 
 */
export function loginApi (data){
    const formData = new FormData();
    for(let key in data){
        formData.append(key,data[key]);
    }
    return request({
        url:"/api/v1/auth/login",
        method:'post',
        data:formData,
        headers: {
            "Content-Type": "multipart/form-data",
          },
    })
}


export function logoutApi(){
    return request({
        url:'/api/v1/auth/logout',
        method:'delete'
    })
}

export function getCaptchaApi(){
    return request({
        url:'/api/v1/auth/captcha',
        method:'get',
    })
}

