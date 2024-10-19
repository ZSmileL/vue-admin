<template>
    <div class="dialog-container">
        <el-dialog
            :title="dialogConfig.title"
            v-model="dialogConfig.show"
            :width="width"
            @close="close"
            :close-on-click-modal="false"
            >
            <slot></slot>
            <template #footer>
            <span>
                <el-button type="primary" @click="submit">确认</el-button>
                <el-button @click="close">取消</el-button>
            </span>
            </template>
        </el-dialog>
        
    </div>
</template>

<script setup>
const props = defineProps({
    dialogConfig:{
        type:Object,
        required:true
    },
    width:{
        type:String,
        default:"50%"
    }
})
const emits = defineEmits(["close","submit"]);
const close = ()=>{
    emits("close");
}
const submit = ()=>{
    emits("submit");
}

</script>

<style lang="scss" scoped>

</style>