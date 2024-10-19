<template>
    <div class="dept-containner">
        <div class="search-form">
            <el-form :model="queryParams" ref="searchUserOptionRef" :inline="true" style="display: flex;">
                <el-form-item label="关键字">
                    <el-input v-model="queryParams.keywords" placeholder="部门名称" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-form-item label="部门状态">
                        <el-select v-model="queryParams.status" placeholder="全部" style="width: 100px;" clearable
                            filterable>
                            <el-option :key="1" label="正常" :value="1"></el-option>
                            <el-option :key="0" label="禁用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item></el-form-item>
                    <el-button type="primary" @click="getDept"><span class="iconfont icon-search"></span>
                        搜索</el-button>
                    <el-button @click="reset()"> <span class="iconfont icon-search"></span>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="dept-table">
            <el-card shadow="always" :body-style="{ padding: '20px' }">
                <template #header>
                    <div>
                        <el-button type="success" v-hasPerm="'sys:dept:add'" size="default"
                            @click="showDialog(0, true)">新增</el-button>
                        <el-button type="danger" size="default" v-hasPerm="'sys:dept:delete'"
                            :disabled="!selected.length" @click="deptDelete()">删除</el-button>

                    </div>
                </template>
                <el-table row-key="id" :data="depts" stripe @selection-change="select">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="部门名称" prop="name">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="scope">
                            <el-tag v-if="scope.row.status" type="success" size="normal">启用</el-tag>
                            <el-tag v-else type="info" size="normal">禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" width="120">

                    </el-table-column>
                    <el-table-column label="操作" width="220">
                        <template #default="scope">
                            <el-button type="primary" v-hasPerm="'sys:dept:add'" size="small" link
                                @click="showDialog(0, false, scope.row)">新增</el-button>
                            <el-button type="primary" v-hasPerm="'sys:dept:edit'" size="small" link
                                @click="showDialog(1, false, scope.row)">编辑</el-button>
                            <el-button v-hasPerm="'sys:dept:delete'" type="primary" size="small" link
                                @click="deptDelete(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-card>

        </div>
        <Dialog :dialogConfig="deptDialogConfig" @close="closeDialog" @submit="submit" width="30vw">
            <el-form :model="deptForm" ref="deptFormRef" :rules="deptFormRules" label-width="80px" :inline="false"
                size="normal">
                <el-form-item label="上级部门" prop="parentId">
                    <el-tree-select :disabled="!canSelPDept" highlight-current v-model="deptForm.parentId"
                        node-key="value" :data="deptParents" check-strictly />
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="deptForm.name" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="显示排序" prop="sort">
                    <el-input v-model="deptForm.sort" type="number" style="width: 120px;" :min="0"></el-input>
                </el-form-item>
                <el-form-item label="部门状态">
                    <el-radio-group v-model="deptForm.status">
                        <el-radio :value="1" label="正常"></el-radio>
                        <el-radio :value="0" label="禁用"></el-radio>
                    </el-radio-group>

                </el-form-item>
            </el-form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getDeptsListApi, getDeptOptions, getDeptByIdApi, saveDeptApi, deleteDeptApi, updateDeptApi } from '@/api/dept'
import { ElMessageBox } from 'element-plus';
const { proxy } = getCurrentInstance();
const queryParams = ref({});
const depts = ref([]);
//0:新增 1：修改
const opType = ref(0);
//是否可以修改或选择父级部门
const canSelPDept = ref(false);
//修改部门的Id
const beUpdatedDept = ref();
/**
 * 获取所有部门
 */
const getDept = () => {
    getDeptsListApi(queryParams.value)
        .then(({ data }) => {
            depts.value = data;
        })
}
//部门下拉列表
const deptParents = ref([
    {
        value: 0,
        label: "顶级部门"
    }
])
/**
 * 获取部门下拉列表
 */
const getDeptOption = () => {
    getDeptOptions()
        .then(({ data }) => {
            deptParents.value[0].children = data;
            // console.log(deptParents.value)
        })
}
const reset = () => {
    Object.assign(queryParams.value, {
        keywords: null,
        status: null
    })
    getDept();
}
//选中数据
const selected = ref([]);
const select = (val) => {
    if (Array.isArray(val)) {
        //如果是数组，代表是全选
        //之前选中了部分，这次全选
        selected.value = val;
    } else {
        //单选，先查是否已有这个数据，如果有，这次是取消，需要删除，如果没有，这次是勾选，需要添加
        const index = selected.value.findIndex((item) => item.id == val.id);
        if (index == -1) {
            selected.value.push(val);
        } else {
            selected.value.splice(index, 1);
        }
    }
}
/**
 * 删除部门
 * @param {*} deptId 
 */
const deptDelete = (deptId) => {
    let ids;
    if (deptId) {
        ids = deptId;
    } else {
        ids = selected.value.map((dept) => dept.id).join(",");
    }
    console.log(ids);
    ElMessageBox.confirm(
        "确认删除已选中的数据？",
        "警告",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }
    ).then(() => {
        deleteDeptApi(ids)
            .then(() => {
                proxy.Message.success("删除成功");
                getDept();
            })
            .catch((err) => {
                proxy.Message.warning("删除失败");
            })
    })

}
//Dialog
const deptDialogConfig = ref({
    show: false
})
const deptForm = ref({
    parentId: 0,
    status: 1,
    sort: 1
});
const deptFormRef = ref();
const deptFormRules = {
    parentId: [
        { required: 'true', message: "请选择父级部门" }
    ],
    name: [
        { required: 'true', message: "请填写部门名称" }
    ],
    sort: [
        { required: 'true', message: "请输入显示排序" }
    ],
}
/**
 * 
 * @param {*} type 对话框类型 0：新增 1：编辑
 * @param {*} canChangePpept    是否可以修改或选择父级部门
 * @param {*} option    配置项 主要用来获取Id 可不传
 */
const showDialog = async (type, canChangePpept, option) => {
    getDeptOption();
    opType.value = type;
    deptDialogConfig.value.title = type ? "修改部门" : "新增部门";
    canSelPDept.value = canChangePpept;
    if (type) {
        await getDeptByIdApi(option.id)
            .then(({ data }) => {
                deptForm.value = data;
            })
        beUpdatedDept.value = option.id;
    } else {
        if (option) {
            deptForm.value.parentId = option.id
        }
    }

    deptDialogConfig.value.show = true;

}
const closeDialog = () => {
    resetForm();
    deptDialogConfig.value.show = false;
}
const resetForm = () => {
    deptFormRef.value.resetFields();
    for(let k in deptForm.value){
        deptForm[k] = null;
    }
    Object.assign(deptForm.value, {
        parentId: 0,
        status: 1,
        sort: 1
    })
}
const submit = () => {
    deptFormRef.value.validate(async (validate) => {
        if (validate) {
            if (opType.value==1) {
                console.log(beUpdatedDept.value)
                //编辑
                await updateDeptApi(beUpdatedDept.value,deptForm.value)
                .then(()=>{
                    proxy.Message.success("修改成功")
                })
            }else{
                await saveDeptApi(deptForm.value)
                .then(()=>{
                    proxy.Message.success("添加成功")
                })
            }
            closeDialog();
            getDept();
        }
    })
}





onMounted(() => {
    getDept();
})
</script>

<style lang="scss" scoped>
.dept-containner {}
</style>