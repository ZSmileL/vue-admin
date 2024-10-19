<template>
    <el-tooltip :content="`下载${chartName}`" placement="bottom" effect="light">
        <div class="iconfont icon-download" @click="DownLoadChart"></div>
    </el-tooltip>
    
</template>

<script setup>

const props = defineProps({
    chart:{
        // echart实例
        type:Object,
        required:true,
    },
    //图表名
    chartName:{
        type: String,
        required:true
    }
})
const DownLoadChart = ()=>{
    //获取画布图表地址信息
    const img = new Image();
    //导出图表图片，返回一个base64的URl
    img.src = props.chart.getDataURL({
        pixelRatio:2,   //导出的图片分辨率比例
        backgroundColor: '#fff'     //导出的图片背景色
    });
    //当图片加载完成后，生成url并下载
    img.onload = ()=>{
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if(ctx){
            ctx.drawImage(img,0,0,img.width,img.height);
            const link = document.createElement("a");
            link.href = canvas.toDataURL();
            link.download = props.chartName;  //下载文件名
            // document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }
}
</script>

<style lang="scss" scoped>
.iconfont{
    cursor: pointer;
    font-weight: bolder;
}
</style>