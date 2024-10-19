<template>
    <div class="user-container">
        <deptTree v-model:deptId="queryParams.deptId" @loadData="getuserList"></deptTree>
        <div class="user-table-container">
            <div class="search-form">
                <el-form :model="queryParams" ref="searchUserOptionRef" :inline="true" style="display: flex;">
                    <el-form-item label="关键字">
                        <el-input v-model="queryParams.keywords" placeholder="用户名/昵称/手机号" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px;">
                            <el-option :value="1" label="启用">
                            </el-option>
                            <el-option :value="0" label="禁用">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker style="width: 240px;" v-model="timeRange" type="daterange" range-separator="~"
                            start-placeholder="开始时间" end-placeholder="结束时间" size="default" format="YYYY-MM-DD" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getuserList"><span class="iconfont icon-search"></span>
                            搜索</el-button>
                        <el-button @click="reset"> <span class="iconfont icon-search"></span>重置</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <div class="user-table">
                <el-card shadow="never" :body-style="{ padding: '20px' }">
                    <template #header>
                        <div class="user-header">
                            <div class="header-left">
                                <el-button type="success" v-hasPerm="'sys:user:add'" size="default"
                                    @click="showDialog(0)">新增</el-button>
                                <el-button type="danger" v-hasPerm="'sys:user:delete'" size="default" @click="deleteUser()"
                                    :disabled="!selected.length">删除</el-button>
                            </div>
                            <div class="header-right">
                                <el-button @click="">导入</el-button>
                                <el-button @click="">导出</el-button>
                            </div>
                        </div>
                    </template>
                    <el-table ref="multipleTableRef" :data="users" style="width: 100%" @selection-change="select">
                        <el-table-column type="selection" width="50" />
                        <el-table-column property="id" label="编号" width="100" align="center">
                        </el-table-column>
                        <el-table-column property="username" label="用户名" width="100" align="center" />
                        <el-table-column property="nickname" label="用户昵称" width="100" align="center" />
                        <el-table-column property="genderLabel" label="性别" width="100" align="center" />
                        <el-table-column property="deptName" label="部门" width="100" align="center" />
                        <el-table-column property="mobile" label="手机号码" width="120" align="center" />
                        <el-table-column property="status" label="状态" width="100" align="center">
                            <template #default="scope">
                                <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
                                <el-tag type="info" v-else>禁用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column property="createTime" label="创建时间" width="180" align="center" />
                        <el-table-column fixed="right" label="操作" width="220" align="center">
                            <template #default="scope">
                                <el-button type="primary" size="small" link @click="resetPwd(scope.row.id,scope.row.username)">重置密码</el-button>
                                <el-button type="primary" size="small" link
                                    @click="showDialog(1, scope.row.id)">编辑</el-button>
                                <el-button type="primary" size="small" link @click="deleteUser(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <Pagination class="pagination" v-if="total > 0" :total="total" v-model:pageSize="queryParams.pageSize"
                        v-model:page="queryParams.pageNum" @loadData="getuserList"></Pagination>

                </el-card>

            </div>
        </div>
        <Dialog :dialogConfig="dialogConfig" @close="closeDialog" @submit="submit">
            <el-form :model="UserForm" ref="UserFormRef" :rules="userFormRules" label-width="80px" :inline="false"
                size="normal">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="UserForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname">
                    <el-input v-model="UserForm.nickname" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptId">

                    <el-tree-select v-model="UserForm.deptId" check-strictly clearable :data="depts" style="width: 100%" />

                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="UserForm.gender" placeholder="请选择" clearable filterable>
                        <el-option :value="1" label="男"></el-option>
                        <el-option :value="2" label="女"></el-option>
                        <el-option :value="0" label="未知"></el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="角色" prop="roleIds">
                    <el-select multiple v-model="UserForm.roleIds" placeholder="请选择" clearable>
                        <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="UserForm.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="UserForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="UserForm.status">
                        <el-radio :value="1" label="正常"></el-radio>
                        <el-radio :value="0" label="禁用"></el-radio>
                    </el-radio-group>

                </el-form-item>
            </el-form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from "vue"
import deptTree from "./components/dept-tree.vue";
import { getUserPage, deleteUserApi, InsertUserApi, updateUserApi, getEditUserApi, updatePwdApi } from "@/api/user"
import { getDeptOptions } from "@/api/dept"
import { getRolesApi, } from "@/api/role"
import { ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
//被编辑用户Id
const editUserId = ref(0);
//部门列表
const depts = ref([]);
//角色列表
const roles = ref([]);
//用户列表
const users = ref([]);
//总用户数
const total = ref();
//选中用户列表
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
//时间范围
const timeRange = ref([]);
watch(timeRange, (nVal, oVal) => {
    queryParams.value.startTime = nVal[0];
    queryParams.value.endTime = nVal[1];
})
//用户表单
const UserForm = ref({
    status: 1,
});
const UserFormRef = ref();
//表单检验规则
const userFormRules = {
    username: [
        { required: true, message: "用户名不能为空" }
    ],
    nickname: [
        { required: true, message: "用户昵称不能为空" }
    ],
    deptId: [
        { required: true, message: "所属部门不能为空" }
    ],
    roleIds: [
        { required: true, message: "角色不能为空", trigger: "blur" }
    ],
    email: [
        {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "请输入正确的邮箱地址",
            trigger: "blur",
        },
    ],
    mobile: [
        {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
        },
    ],
}
//查询用户信息参数
const queryParams = ref({
    pageSize: 10,
    pageNum: 1
})
//查询用户
const getuserList = () => {
    getUserPage(queryParams.value)
        .then(({ data }) => {
            users.value = data.list;
            total.value = data.total;
        })
}
//重置搜索项
const reset = () => {
    Object.assign(queryParams.value, {
        keywords: null,
        status: null,
        startTime: null,
        endTime: null,
        deptId: null,
        pageNum:1,
    })
    timeRange.value = [];
    getuserList();
}
/**
 * 删除用户
 * @param {*} id 
 */
const deleteUser = (id) => {
    //没有传入id，删除多项，即选中项selected
    if (!id) {
        id = selected.value.map((item) => {
            return item.id;
        }).join(",");
    }
   ElMessageBox.confirm(
    "确认删除用户？",
    "警告",
    {
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
    }
   )
   .then(()=>{
        deleteUserApi(id)
        .then(() => {
            proxy.Message.success("删除成功")
            reset();
        })
    })
}
//对话框
//对话框类型 0：新增，1：修改
const dialogType = ref(0);
const dialogConfig = ref({
    show: false,
    title: "标题"
})
//重置表单
const resetForm = () => {
    UserFormRef.value.resetFields();
    for (let key in UserForm.value) {
        UserForm.value[key] = "";
    }
    Object.assign(UserForm.value, {
        status: 1
    })
}
//关闭对话框
const closeDialog = () => {
    dialogConfig.value.show = false;
    //重置表单
    resetForm();
}
/**
 * 打开对话框
 * @param {*} type 对话框事务：0：新增 1：修改
 */
const showDialog = async (type, userId) => {
    dialogType.value = type;
    dialogConfig.value.show = true;
    dialogConfig.value.title = type ? "修改用户" : "新增用户";
    await getDeptOptions().then(({ data }) => depts.value = data);
    await getRolesApi().then(({ data }) => roles.value = data);
    if (type == 1) {
        editUserId.value = userId;
        getEditUserApi(userId)
            .then(({ data }) => {
                Object.assign(UserForm.value, data);
            })
    }
}
//提交
const submit = () => {
    UserFormRef.value.validate(async (validate) => {
        if (validate) {
            if (dialogType.value == 0) {
                //新增
                await InsertUserApi(UserForm.value);
            } else if (dialogType.value == 1) {
                //修改
                await updateUserApi(editUserId.value, UserForm.value);
            }
            closeDialog();
            reset();
        }
    })

}
//重置密码
const resetPwd = (userId,username)=>{
    ElMessageBox.prompt(
        `请输入用户[${username}]的新密码`,
        "重置密码",
        {
            confirmButtonText:"确认",
            cancelButtonText:"取消"
        }
    ).then(({value})=>{
        updatePwdApi(userId,value);
    })
}
onMounted(() => {
    getuserList();
})
</script>

<style lang="scss" scoped>
.user-container {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;

    .user-table-container {
        margin-left: 20px;
        max-width: 80%;

        .user-table {
            width: 100%;
            background-color: #fff;

            .user-header {
                display: flex;
                justify-content: space-between;
            }

            .pagination {
                margin-top: 10px;
            }
        }
    }

}
</style>