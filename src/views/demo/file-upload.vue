<template>
    <div>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="totalPercentage" style="margin-bottom: 10px;"
            v-if="showProgress" />
        <el-upload drag :http-request="uploadFile" multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                将文件拖到此处 或者<em>点击上传</em>
            </div>
        </el-upload>
    </div>
</template>

<script setup>
import { UploadFilled, } from '@element-plus/icons-vue'
import { computed, ref, watch, watchEffect, getCurrentInstance, toRaw } from 'vue'
import { uploadFileApi, mergeFileApi, verifyFileApi } from '@/api/file'
const { proxy } = getCurrentInstance();
//进度条显示
const showProgress = ref(false);
const totalPercentage = ref(0);
if(sessionStorage.getItem("fileUpload")){
    showProgress.value = true;
    totalPercentage.value = sessionStorage.getItem("fileUpload");
}
const chunksList = ref([]);
const CHUNK_SIZE = 2 * 1024 * 1024;
//文件hash
const fileHash = ref("");
//已上传切片
const uploaded = ref([]);
const uploadFile = async ({ file }) => {
    showProgress.value = true;
    chunksList.value = creatChunks(file);
    const hash = await calculateHash(chunksList.value);
    fileHash.value = hash;
    if(! await verifyFile(file.name,hash)){
        totalPercentage.value = 100;
        closeProgress();
       return;
    }
    upload(chunksList.value);
}

/**
 * 验证文件是否已经上传（秒传）
 * @param {*} fileName 文件名
 * @param {*} hash 文件哈希
 */
const verifyFile = async (fileName, hash)=>{
    const {shouldUpload, uploadedList} = await verifyFileApi(fileName, hash);
    uploaded.value = uploadedList||[];
    return shouldUpload;
}

/**
 * 生成文件hash
 * @param {*} chunks 文件分片列表
 */
const calculateHash = (chunks) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('/hash.js');
        worker.postMessage( toRaw(chunks) );
        worker.onmessage = ({data})=>{
            resolve(data);
        }
    })
}
const uploaded_file = ref({});
/**
 * 文件分片
 * @param {*} file  文件
 */
const creatChunks = (file) => {
    uploaded_file.value = file;
    let chunks = [];
    let start = 0;
    while (start < file.size) {
        //用的不是Array的slice,而是Blob的
        chunks.push({ file: file.slice(start, start + CHUNK_SIZE) });
        start += CHUNK_SIZE;
    }
    chunks = chunks.map((chunk, index) => {
        return {
            file: chunk.file,
            fileName: file.name,
            // hash: `${file.name}-${index}`,
            size: chunk.file.size,
            percentage: 0
        }
    });
    return chunks;
}
/**
 * 上传文件
 * @param {*} chunks 分片 
 */
const upload = async (chunks) => {
    
    const requestList = chunks.map((chunk,index) => {
        chunk.hash = `${fileHash.value}-${index}`
        const formData = new FormData();
        for (let k in chunk) {
            formData.append(k, chunk[k]);
        }
        return { formData };
    })
    .reduce((pre,{ formData },index)=>{
        if(!uploaded.value.includes(chunks[index].hash)){
             pre.push(uploadFileApi(formData, onUploadProgress(chunks[index])));
        }else{
            chunksList.value[index].percentage = 1;
        }
        return pre;
    },[]);
        // .map(({ formData }, index) => {
        //     if(uploaded.value.includes(chunks[index].hash)){
        //         return ;
        //     }else{
        //         // return uploadFileApi(formData, onUploadProgress(chunks[index]));
        //         return index;
        //     }
        // });
    Promise.all(requestList).then(() => {
        merge();
    })
}

const merge = async () => {
    const data = {
        fileName: uploaded_file.value.name,
        size: CHUNK_SIZE,
        hash:fileHash.value
    }
    await mergeFileApi(JSON.stringify(data));
}
/**
 * 进度条函数
 * @param {*} e 事件对象 
 */
const onUploadProgress = (item) => {
    return (e) => {
        item.percentage = e.loaded / e.total;
    }
}
/**
 * 关闭进度条
 */
const closeProgress = ()=>{
    setTimeout(() => {
                proxy.Message.success("上传完成");
                totalPercentage.value = 0;
                showProgress.value = false;
                sessionStorage.removeItem('fileUpload');
            }, 1000)
}
// let totalPercentage = computed(()=>{
//     if(!uploaded_file.value.fileName){
//         return 0;
//     }
//     const loaded = chunksList.value.reduce((pre,cur)=>{
//         return pre + cur.size * cur.percentage;
//     },0)
//     console.log(loaded);
//     return loaded/uploaded_file.value.size; 
// })
watch(() => chunksList.value.map((chunk) => chunk.percentage), () => {
    if (!uploaded_file.value.name) {
        // console.log(111111)
        totalPercentage.value = 0;
    } else {
        const loaded = chunksList.value.reduce((pre, cur) => {
            return pre + cur.size * cur.percentage;
        }, 0)
        totalPercentage.value = Math.floor((loaded / uploaded_file.value.size) * 100);
        sessionStorage.setItem('fileUpload',totalPercentage.value);
        console.log(11111);
        if (totalPercentage.value == 100) {
            closeProgress();
        }
    }
}, {
    deep: true
})


</script>

<style lang="scss" scoped></style>