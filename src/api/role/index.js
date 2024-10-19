import request from '@/utils/request.js'

/**
 * 获取所有角色类型
 * @returns 
 */
export const getRolesApi = ()=>{
    return request({
        url:"/api/v1/roles/options",
        method:'get'
    })
}

/**
 * 角色分页列表
 */
export const getRolesPageApi = (queryParams)=>{
    return request({
        url:'/api/v1/roles/page',
        method:'get',
        params:queryParams
    })
}

/**
 * 获取被修改角色信息
 * @param {*} roleId 
 */
export const getEditRoleApi = (roleId)=>{
    return request({
        url: `api/v1/roles/${roleId}/form`,
        method:'get',
    })
}

/**
 * 删除角色
 * @param {*} ids 
 * @returns 
 */
export const deleteRoleApi = (ids)=>{
    return request({
        url:`/api/v1/roles/${ids}`,
        method:'delete'
    })
}

/**
 * 新增角色
 * @param {*} formData 
 * @returns 
 */
export const addRoleApi = (formData)=>{
    return request({
        url:'/api/v1/roles',
        method:'post',
        data:formData
    })
}

/**
 * 修改角色
 * @param {*} formData 
 * @returns 
 */
export const updateRoleApi = (roleId,formData)=>{
    return request({
        url:`/api/v1/roles/${roleId}`,
        method:'put',
        data:formData
    })
}
/**
 * 获取角色拥有的权限（按钮级）
 * @param {*} roleId 
 * @returns 
 */
export const getRoleAuthApi = (roleId)=>{
    return request({
        url:`/api/v1/roles/${roleId}/menuIds`,
        method:'get'
    })
}

export const updataeRoleAuthAPi = (roleId,auths)=>{
    console.log(auths)
    return request({
        url:`/api/v1/roles/${roleId}/menus`,
        method:'put',
        data:auths
    })
}