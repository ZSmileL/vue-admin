<template>
    <div>
        <el-pagination 
        v-model:currentPage="currentPage"
        @current-change = currentChange 
        :total="total" 
        :page-sizes="[5 , 10, 20, 40, 80]" 
        v-model:page-size="pageSize"
        @size-change="pageSizeChange"
        layout="total, sizes, prev, pager, next, jumper" 
         background>
        </el-pagination>
    </div>
</template>

<script setup>
import {ref,watch } from 'vue'
const props = defineProps({
    total:{
        type:Number
    },
    pageSize:{
        type:Number,
        default:0
    },
    page:{
        type:Number,
        default:1,
    }
})
const emits = defineEmits(["loadData","update:page","update:pageSize"])
const currentPage = ref(props.page);
const pageSize = ref(props.pageSize);
// watch(pageSize,(nVal)=>{
//     console.log
// })
const currentChange = ()=>{
    emits("update:page",currentPage.value);
    emits("loadData");
}
const pageSizeChange = ()=>{
    emits("update:pageSize",pageSize.value);
    emits("loadData");
}
</script>

<style lang="scss" scoped></style>