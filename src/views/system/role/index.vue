<template>
    <div class="role-container">
        <div class="role-table-container">
            <div class="search-form">
                <el-form :model="queryParams" :inline="true" style="display: flex;">
                    <el-form-item label="关键字">
                        <el-input v-model="queryParams.keywords" placeholder="角色名称" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getRolePage"><span class="iconfont icon-search"></span>
                            搜索</el-button>
                        <el-button @click="reset()"> <span class="iconfont icon-search"></span>重置</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <div class="role-table">
                <el-card shadow="never" :body-style="{ padding: '20px' }">
                    <template #header>
                        <div class="user-header">
                            <div class="header-left">
                                <el-button type="success" v-hasPerm="'sys:role:add'" size="default"
                                    @click="showDialog(0)">新增</el-button>
                                <el-button type="danger" v-hasPerm="'sys:role:delete'" size="default"
                                    @click="deleteRole()" :disabled="!selected.length">删除</el-button>
                            </div>
                        </div>
                    </template>
                    <el-table border ref="multipleTableRef" :data="Roles" style="width: 100%"
                        @selection-change="select">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column property="name" label="角色名称" min-width="100">
                        </el-table-column>
                        <el-table-column property="code" label="角色编码" width="150" />
                        <el-table-column property="status" label="状态" width="100">
                            <template #default="scope">
                                <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
                                <el-tag type="info" v-else>禁用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column property="sort" label="排序" width="80" />
                        <el-table-column label="操作" width="220">
                            <template #default="scope">
                                <el-button type="primary" size="small" link
                                    @click="resetAuth(scope.row.id, scope.row.name)">分配权限</el-button>
                                <el-button type="primary" size="small" link
                                    @click="showDialog(1, scope.row.id)">编辑</el-button>
                                <el-button type="primary" size="small" link
                                    @click="deleteRole(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <Pagination class="pagination" v-if="total > 0" :total="total"
                        v-model:pageSize="queryParams.pageSize" v-model:page="queryParams.pageNum"
                        @loadData="getRolePage"></Pagination>

                </el-card>

            </div>
        </div>
        <Dialog width="35vw" :dialogConfig="dialogConfig" @close="closeDialog" @submit="submit">
            <el-form :model="RoleForm" ref="RoleFormRef" :rules="userFormRules" label-width="80px" :inline="false">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="RoleForm.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="RoleForm.code" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="数据权限" prop="dataScope">
                    <el-select v-model="RoleForm.dataScope" placeholder="请选择" clearable>
                        <el-option :key="0" label="全部数据" :value="0" />
                        <el-option :key="1" label="部门及子部门数据" :value="1" />
                        <el-option :key="2" label="本部门数据" :value="2" />
                        <el-option :key="3" label="本人数据" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="RoleForm.status">
                        <el-radio :value="1" label="正常"></el-radio>
                        <el-radio :value="0" label="禁用"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="RoleForm.sort" type="number" min="0" clearable></el-input>
                </el-form-item>

            </el-form>

        </Dialog>
        <!-- 分配权限对话框 -->
        <Dialog :dialogConfig="authDialog" @submit="authSubmit">
            <el-scrollbar height="40vh">
                <el-tree node-key="value" ref="authRef" :data="authMenus" default-expand-all
                    :default-checked-keys="selectAuth" show-checkbox @node-click="">
                    <template #default="{ data }">
                        {{ data.label }}
                    </template>
                </el-tree>

            </el-scrollbar>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, h } from 'vue'
import { getRolesPageApi, getEditRoleApi, deleteRoleApi, addRoleApi, updateRoleApi, getRoleAuthApi, updataeRoleAuthAPi } from "@/api/role"
import { getMenuOptionsApi, } from '@/api/menu'
import { ElMessageBox, ElTree } from 'element-plus';
const { proxy } = getCurrentInstance();
//对话框类型 0:新增 1：编辑
const dType = ref(0);
//编辑角色Id
const editRoleId = ref(0);
//role列表 当页
const Roles = ref([]);
//total,总数
const total = ref(0);
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
//查询参数
const queryParams = ref({
    pageNum: 1,
    pageSize: 10
});
//分页查询
const getRolePage = () => {
    getRolesPageApi(queryParams.value)
        .then(({ data }) => {
            Roles.value = data.list;
            total.value = data.total;
        })
};
//重置查询
const reset = (pageNum = 1) => {
    console.log(pageNum)
    Object.assign(queryParams.value, {
        keywords: null,
        pageNum: pageNum,
    })
    getRolePage();
}
//删除角色
const deleteRole = (id) => {
    if (!id) {
        id = selected.value.map((item) => {
            return item.id;
        }).join(",");
    }
    ElMessageBox.confirm(
        "确认删除角色？",
        "警告",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }
    )
        .then(() => {
            deleteRoleApi(id)
                .then(() => {
                    proxy.Message.success("删除成功")
                    reset(queryParams.value.pageNum);
                })
        })
}
//对话框
const dialogConfig = ref({
    show: false
})
const showDialog = (type, roleId) => {
    dType.value = type;
    dialogConfig.value.show = true;
    dialogConfig.value.title = type ? "修改角色" : "新增角色";
    if (type == 1) {
        editRoleId.value = roleId;
        getEditRoleApi(roleId)
            .then(({ data }) => {
                Object.assign(RoleForm.value, data);
                console.log(RoleForm.value)
            })
    }
}
const closeDialog = () => {
    dialogConfig.value.show = false;
    //重置表单
    resetForm();
}
const resetForm = () => {
    RoleFormRef.value.resetFields();
    for (let k in RoleForm.value) {
        RoleForm.value[k] = null;
    }
    Object.assign(RoleForm.value, {
        status: 1,
        sort: 1
    })
}
const RoleForm = ref({
    status: 1,
    sort: 1
})
const userFormRules = {
    name:[
        {required:true,message:"请输入角色名称",trigger:'blur'},
    ],
    code:[
        {required:true,message:"请输入角色编码",trigger:'blur'},
    ],
    dataScope:[
        {required:true,message:"请炫则数据权限"},
    ],
    status:[
        {required:true,message:"请选择状态"}
    ]
}
const RoleFormRef = ref();
//提交表单
const submit = async () => {
    RoleFormRef.value.validate(async (validate) => {
        console.log(validate)
        if (validate) {
            if (dType.value == 0) {
                //新增
                await addRoleApi(RoleForm.value);
            } else if (dType.value == 1) {
                //修改
                await updateRoleApi(editRoleId.value, RoleForm.value);
            }
            closeDialog();
            reset(queryParams.value.pageNum);
        }
    })
}
//分配权限
let updateAuthRoleId;
const authMenus = ref({});
const authRef = ref();
const authDialog = ref({
    show: false,
})
const resetAuth = async (id, name) => {
    await getMenuOptionsApi().then(({ data }) => {
        authMenus.value = data
        //回显角色已拥有的菜单
        getRoleAuthApi(id).then(({ data }) => {
            // data.forEach(menuId => {
            //     authRef.value.setChecked(menuId,true,false);
            // });
            authRef.value.setCheckedKeys(data)
        })
    });
    updateAuthRoleId = id;
    authDialog.value.show = true;
    authDialog.value.title = `[${name}]权限分配`
}
//修改权限提交
const authSubmit = () => {
    updataeRoleAuthAPi(updateAuthRoleId, authRef.value.getCheckedKeys())
        .then(() => {
            proxy.Message.success("分配权限成功")
            authDialog.value.show = false;
        })
}
onMounted(() => {
    getRolePage();
})

</script>

<style lang="scss" scoped>
.role-container {
    margin-left: 10px;

    .role-table-container {

        .pagination {
            margin-top: 10px;
        }
    }
}
</style>