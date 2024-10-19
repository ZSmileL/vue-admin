import request from '@/utils/request'

/**
 * 所有部门详细信息
 */
export const getDeptsListApi = (queryParams)=>{
    return request({
        url:'/api/v1/dept',
        method:'get',
        params:queryParams
    })
}

/**
 * 获取部门树型下拉列表
 */
export const getDeptOptions = ()=>{
    return request({
        url:"/api/v1/dept/options",
        method:'get',
    });
}

/**
 * 通过Id获取单个部门信息
 * @param {*} deptId 
 * @returns 
 */
export const getDeptByIdApi = (deptId)=>{
    return request({
        url:`/api/v1/dept/${deptId}/form`,
        method:'get'
    })
}

/**
 * 新增部门
 * @param {*} deptForm 
 * @returns 
 */
export const saveDeptApi = (deptForm)=>{
    return request({
        url:'/api/v1/dept',
        method:"post",
        data:deptForm
    })
}

/**
 * 删除部门
 * @param {*} deptIds 
 * @returns 
 */     
export const  deleteDeptApi = (deptIds)=>{
    return request({
        url:`/api/v1/dept/${deptIds}`,
        method:'delete',
    })
}

/**
 * 修改部门
 * @param {*} deptId 
 * @returns 
 */
export const updateDeptApi = (deptId,deptForm)=>{
    console.log(deptId)
    return request({
        url:`/api/v1/dept/${deptId}`,
        method:"put",
        data:deptForm,
    })
}