import request from '@/utils/request.js'


export function getUserInfoApi(){
    return request({
        url:'/api/v1/users/me',
        method:'get'
    })
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function getUserPage(queryParams) {
    return request({
      url: "/api/v1/users/page",
      method: "get",
      params: queryParams,
    });
  }

  export function getEditUserApi(userId){
    return request({
      url:`/api/v1/users/${userId}/form`,
      method:"get",
    })
  }
  /**
   * 新增用户
   * @param {*} data 用户对象 
   * @returns 
   */
  export function InsertUserApi(data){
    // const form = new FormData();
    // for(let k in data){
    //   form.append(k,data[k]);
    // }
    return request({
      url:'/api/v1/users',
      method:'post',
      data:data
    })
  }
/**
 * 删除用户
 * @param {*} ids 用户Id，多个Id用,连接
 * @returns 
 */
  export function deleteUserApi(ids){
    return request({
      url:'/api/v1/users/' + ids,
      method:"delete"
    })
  }
/**
 * 修改用户
 * @param {*} id 被修改用户Id
 * @param {*} form 修改后的数据
 * @returns 
 */
  export function updateUserApi(id,form){
    return request({
      url:'/api/v1/users/' + id,
      method:'put',
      data:form
    })
  }
/**
 * 修改密码
 * @param {*} userId 用户Id
 * @param {*} pwd 新密码
 * @returns 
 */
  export function updatePwdApi(userId,pwd){
    return request({
      url:`/api/v1/users/${userId}/password`,
      method:'patch',
      params:{password:pwd},
    })
  }