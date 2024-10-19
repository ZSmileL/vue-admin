import request from "@/utils/request_node"
/**
 * 上传文件
 * @param {*} chunk 
 * @param {*} processCallBack 
 * @returns 
 */
export const uploadFileApi = (chunk, processCallBack)=>{
    return request({
        url:"/upload",
        method:'post',
        onUploadProgress:processCallBack,
        // headers:{
        //     "Content-Type":"multipart/form-data"
        // },
        data:chunk,
    })
}
/**
 * 合并文件
 * @param {*} data 
 * @returns 
 */
export const mergeFileApi = (data)=>{
    return request({
        url:'/merge',
        method:"post",
        data:data,
    })
}

export const verifyFileApi = (fileName,hash)=>{
    return request({
        url:'/verify',
        method:'post',
        data:{
            fileName,
            hash,
        },
        headers:{
            "Content-Type":"application/json"
        }
    })
}
