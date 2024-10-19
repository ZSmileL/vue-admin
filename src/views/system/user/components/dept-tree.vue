<template>
    <div class="dept-tree">
        <el-input v-model="deptName" placeholder="部门名称" class="search-input">
        <template #prefix>
            <span class="iconfont icon-search"></span>
        </template>    
        </el-input>
        <el-tree
        style="max-width: 100%"
        :data="deptList"
        @node-click="handleNodeClick"
        highlight-current
  />
    </div>
</template>

<script setup>
import {ref, onMounted } from 'vue'
import {getDeptOptions, } from '@/api/dept'
const props = defineProps({
    deptId:{
        type:Number,
    }
})
const emits = defineEmits(["update:deptId","loadData"])
//搜索部门
const deptName = ref("");
//部门列表
const deptList = ref([]);
const getDept = ()=>{
    getDeptOptions()
    .then(({data})=>{
        deptList.value = data;
    })
}
const handleNodeClick = ({value})=>{
    emits("update:deptId",value);
    emits("loadData");
}
onMounted(()=>{
    getDept();
})
</script>

<style lang="scss" scoped>
.dept-tree{
    width: 16%;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    .search-input{
        margin-bottom: 5px;
    }
}
</style>