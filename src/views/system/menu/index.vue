<template>
    <div class="menu-container">
        <div class="search-form">
            <el-form :model="queryParams" ref="searchUserOptionRef" :inline="true" style="display: flex;">
                <el-form-item label="关键字">
                    <el-input v-model="queryParams.keywords" placeholder="菜单名称" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMenus"><span class="iconfont icon-search"></span>
                        搜索</el-button>
                    <el-button @click="reset()"> <span class="iconfont icon-search"></span>重置</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="menu-table">
            <el-card shadow="never">
                <template #header>
                    <el-button type="success" v-hasPerm="'sys:menu:add'" size="default" @click="showDialog(0, true)">
                        新增
                    </el-button>
                </template>
                <el-table row-key="id" :data="menus" :expand-row-keys="['1']">
                    <el-table-column prop="name" label="菜单名称" width="200" />
                    <el-table-column prop="type" label="类型" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.type == MenuType.MENU" type="success">菜单</el-tag>
                            <el-tag v-if="row.type == MenuType.CATALOG" type="warning">目录</el-tag>
                            <el-tag v-if="row.type == MenuType.BUTTON" type="danger">按钮</el-tag>
                            <el-tag v-if="row.type == MenuType.EXTLINK" type="info">外链</el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column prop="path" label="路由路径" width="180" />
                    <el-table-column prop="component" label="组件路径" width="200" />
                    <el-table-column prop="perm" label="权限标识" width="150" align="center" />
                    <el-table-column prop="visible" label="状态" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.visible == 1">启用</el-tag>
                            <el-tag type="info" v-else>禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" width="100" align="center" />
                    <el-table-column label="操作" width="220" fixed="right" align="center">
                        <template #default="scope">
                            <el-button type="primary" v-hasPerm="'sys:menu:add'" size="small" link
                                @click="showDialog(0, false, scope.row)"
                                v-if="!(scope.row.type == MenuType.BUTTON)">新增</el-button>
                            <el-button type="primary" v-hasPerm="'sys:menu:edit'" size="small" link
                                @click="showDialog(1, false, scope.row)">编辑</el-button>
                            <el-button v-hasPerm="'sys:menu:delete'" type="primary" size="small" link
                                @click="deleteMenu(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-card>
        </div>
        <Dialog width="60vw" :dialogConfig="dialogConfig" @close="closeDialog" @submit="submit">
            <el-form :model="menuForm" ref="menuFormRef" :rules="menuFormrules" label-width="160px" :inline="false"
                size="normal">
                <el-form-item label="父级菜单" prop="parentId">
                    <el-tree-select v-model="menuForm.parentId" node-key="value" :data="parents"
                        :disabled="!canSelParent" check-strictly>
                    </el-tree-select>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="menuForm.name" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" prop="type">
                    <el-radio-group v-model="menuForm.type" :disabled="dType==1">
                        <el-radio value="CATALOG" label="目录"></el-radio>
                        <el-radio value="MENU" label="菜单"></el-radio>
                        <el-radio value="BUTTON" label="按钮"></el-radio>
                        <el-radio value="EXTLINK" label="外链"></el-radio>
                    </el-radio-group>

                </el-form-item>
                <el-form-item label="路由路径" prop="path" style="display: flex;"
                    v-if="menuForm.type == MenuType.MENU || menuForm.type == MenuType.CATALOG">
                    <el-input v-model="menuForm.path" :placeholder="menuForm.type == MenuType.MENU ? 'user' : 'system'">

                    </el-input>
                </el-form-item>
                <el-form-item label="页面路径" prop="component" v-if="menuForm.type == MenuType.MENU">
                    <el-input v-model="menuForm.component" placeholder="/system/user/index">
                        <template #prepend>src/views</template>
                        <template #append>.vue</template></el-input>
                </el-form-item>
                <el-form-item label="外链地址" prop="path" v-if="menuForm.type == MenuType.EXTLINK">
                    <el-input v-model="menuForm.path" placeholder="请输入外链完整地址"></el-input>
                </el-form-item>
                <el-form-item label="显示状态" prop="visible" v-if="!(menuForm.type == MenuType.BUTTON)">
                    <el-radio-group v-model="menuForm.visible">
                        <el-radio :value="1" label="显示"></el-radio>
                        <el-radio :value="0" label="隐藏"></el-radio>
                    </el-radio-group>

                </el-form-item>
                <el-form-item label="" v-if="menuForm.type == MenuType.CATALOG" prop="alwaysShow">
                    <template #label>
                        <div>
                            根目录始终显示
                            <el-tooltip placement="bottom" effect="light">
                                <template #content>
                                    <p>是：根目录只有一个子路由显示目录</p>
                                    <p>否：根目录只有一个子路由不显示目录，只显示子路由</p>
                                </template>
                                <el-icon style="vertical-align: -0.15em;" size="1.2em">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip>
                        </div>
                    </template>


                    <el-radio-group v-model="menuForm.alwaysShow" @change="">
                        <el-radio :value="1" label="是"></el-radio>
                        <el-radio :value="0" label="否"></el-radio>
                    </el-radio-group>

                </el-form-item>
                <el-form-item label="是否缓存" prop="keepAlive" v-if="menuForm.type == MenuType.MENU">
                    <el-radio-group v-model="menuForm.keepAlive" @change="">
                        <el-radio :value="1" label="是"></el-radio>
                        <el-radio :value="0" label="否"></el-radio>
                    </el-radio-group>

                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="menuForm.sort" style="width: 100px;" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon" v-if="!(menuForm.type == MenuType.BUTTON)">
                    <el-input v-model="menuForm.parentId"></el-input>
                </el-form-item>
                <el-form-item label="跳转路由" prop="redirect" v-if="menuForm.type == MenuType.CATALOG">
                    <el-input v-model="menuForm.redirect" placeholder="跳转路由"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="perm" v-if="menuForm.type == MenuType.BUTTON">
                    <el-input v-model="menuForm.perm" placeholder="[sys:user:add]"></el-input>
                </el-form-item>
            </el-form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { getMenuListApi, getMenuOptionsApi, getMenuOptionApi, addMenuApi, updateMenuApi, deleteMenuApi } from '@/api/menu'
import { MenuType } from '@/enum/MenuTypeEnum'
import { ElMessageBox } from 'element-plus';
const { proxy } = getCurrentInstance();
//是否可选择父级菜单修改  只有通过最顶级新增时才可选择，通过某一级菜单新增或编辑时不可改
const canSelParent = ref(false);
//菜单列表
const menus = ref([]);
//查询参数
const queryParams = ref({});
//菜单表单
const menuFormRef = ref();
const menuForm = ref({
    parentId: 0,
    type: MenuType.MENU,
    visible: 1,
    alwaysShow: 1,
    keepAlive: 0,
    sort: 1,

});
const menuFormrules = {
    parentId: [
        { required: 'true' }
    ],
    name: [
        { required: 'true', message: '请输入菜单名称', trigger: 'blur' }
    ],
    type: [
        { required: 'true', message: '请选择菜单类型', trigger: 'blur' }
    ],
    path: [
        { required: 'true', message: '请输入路由路径', trigger: 'blur' }
    ],
    component: [
        { required: 'true', message: '请输入页面路径', trigger: 'blur' }
    ],
    visible: [
        { required: 'true', message: '请选择显示状态', trigger: 'blur' }
    ],
}
//父级菜单
const parents = ref([
    {
        value: 0,
        label: '顶级菜单',
    }
]);
//获取菜单
const getMenus = () => {
    getMenuListApi(queryParams.value)
        .then(({ data }) => {
            menus.value = data;
        })
}
//获取父级菜单下拉框
const getMenuOption = () => {
    getMenuOptionsApi()
        .then(({ data }) => {
            parents.value[0].children = data;
        })
}
//重置查询
const reset = () => {
    Object.assign(queryParams.value, {
        keywords: "",
    });
    getMenus();
}
const deleteMenu = (menuId) => {
    ElMessageBox.confirm(
        "确定删除菜单吗?",
        "警告",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }
    ).then(() => {
        deleteMenuApi(menuId)
            .then(() => {
                proxy.Message.success("删除成功");
                getMenus();
            })
    })
}
//对话框
//对话框性质 0：新增 1：删除
const dType = ref(0);
const dialogConfig = ref({
    show: false,
})
/**
 * 
 * @param {*} type 类型 新增/修改
 * @param {*} selParent 是否可以选择父级菜单  只有通过顶级添加按钮才行 
 * @param {*} option 修改时传入，用来获取ID
 */
const showDialog = (type, selParent, option) => {
    getMenuOption();
    dType.value = type;
    canSelParent.value = selParent;
    dialogConfig.value.title = type ? "编辑菜单" : "新增菜单";
    dialogConfig.value.show = true;
    if (type) {
        getMenuOptionApi(option.id)
            .then(({ data }) => {
                menuForm.value = data;
            })
    }
    if(option){
        menuForm.value.parentId = option.id;
    }
}
//关闭对话框
const closeDialog = () => {
    dialogConfig.value.show = false;
    resetForm();
}
const resetForm = () => {
    menuFormRef.value.resetFields();
    for (let k in menuForm.value) {
        menuForm.value[k] = null;
    }
    Object.assign(menuForm.value, {
        parentId: 0,
        type: MenuType.MENU,
        visible: 1,
        alwaysShow: 1,
        keepAlive: 0,
        sort: 1,

    })
}
//提交
const submit = () => {
    menuFormRef.value.validate(async (validate) => {
        if (validate) {
            if (dType.value == 1) {
                await updateMenuApi(menuForm.value);
            } else {
                await addMenuApi(menuForm.value);
            }
            closeDialog();
            reset();
        }
    })
}


onMounted(() => {
    getMenus();
})
</script>

<style lang="scss" scoped></style>