<template>
    <el-card shadow="never" :body-style="{ padding: '20px' }">
        <template #header>
            <div class="card-header">
                <span>产品分类饼图</span>
                <DownLoadChart chartName="产品分类饼图" v-if="chart" :chart="chart"></DownLoadChart>
            </div>
        </template>
        <div :id="id" :style="{ width: width, height: height }"></div>
    </el-card>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'
import DownLoadChart from './DownLoadChart.vue';
import * as echarts from "echarts"
const chart = ref("");
const props = defineProps({
    id: {
        type: String,
        required: true,
        default: "barChart",
    },
    width: {
        type: String,
        default: "200px",
        required: true,
    },
    height: {
        type: String,
        default: "200px",
        required: true
    }
})
//柱状图配置
const options = {
    grid: {
        left: "2%",
        right: "2%",
        bottom: "10%",
        containLabel: true,
    },
    legend: {
        top: "bottom",
        textStyle: {
            color: "#999",
        },
    },
    //画图
    series: [
        {
            type: "pie",
            center: ["50%", "50%"],
            radius: [35, 100],
            data: [
                {
                    name: "手机数码",
                    value: 35
                },
                {
                    name: "家用电器",
                    value: 23
                },
                {
                    name: "汽车用品",
                    value: 15
                },
                {
                    name: "户外运动",
                    value: 27
                },
            ],
            // roseType:"radius",//是否展示成南丁格尔图，通过半径区分数据大小
            itemStyle: {
                borderRadius:1,
                color: (params) => {
                    //自定义颜色
                    const colorList = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];
                    return colorList[params.dataIndex];
                }
            }
        },
    ]
}

onMounted(() => {
    //图标初始化
    chart.value = markRaw(
        echarts.init(document.getElementById(props.id))
    )
    chart.value.setOption(options);

})
</script>

<style lang="scss" scoped>
:deep(.card-header){
    font-size: 16px;
    display: flex;
    justify-content: space-between;

}
</style>