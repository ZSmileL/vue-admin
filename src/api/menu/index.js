import request from '@/utils/request'
/**
 * 获取路由列表
 * @returns 
 */
export const getRoutesApi = ()=>{
    return request({
        url:'/api/v1/menus/routes',
        method:'get',
    })
}

/**
 * 获取权限菜单下拉列表
 */
export const getMenuOptionsApi = ()=>{
    return request({
        url:'/api/v1/menus/options',
        method:'get'
    })
}

/**
 * 获取菜单详细列表
 * @param {*} query 
 * @returns 
 */
export const getMenuListApi = (query)=>{
    return request({
        url:'/api/v1/menus',
        method:'get',
        params:query,
    })
}
/**
 * 获取单个Menu信息
 * @param {*} id 
 * @returns 
 */
export const getMenuOptionApi = (id)=>{
    return request({
        url:`/api/v1/menus/${id}/form`,
        method:"get"
    })
}
/**
 * 添加菜单
 * @param {*} menu 
 */
export const addMenuApi = (menu)=>{
    return request({
        url:'/api/v1/menus',
        method:'post',
        data:menu,
    })
}
/**
 * 修改菜单
 * @param {*} menu 
 * @returns 
 */
export const updateMenuApi = (menu)=>{
    return request({
        url:`/api/v1/menus/${menu.id}`,
        method:"put",
        data:menu,
    })
}
/**
 * 删除菜单
 * @param {*} id 
 * @returns 
 */
export const deleteMenuApi = (id)=>{
    return request({
        url:`/api/v1/menus/${id}`,
        method:"delete"
    })
}