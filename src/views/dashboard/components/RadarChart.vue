<template>
    <el-card shadow="never" :body-style="{ padding: '20px' }">
        <template #header>
            <div class="card-header">
                <span>订单状态雷达图</span>
                <DownLoadChart chartName="订单状态雷达图" v-if="chart" :chart="chart"></DownLoadChart>
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
    radar:{
                indicator:[
                    {text:"家用电器"},
                    {text:"家具厨具"},
                    {text:"汽车用品"},
                    {text:"手机数码"},
                    {text:"运动户外"},
                    {text:"服装箱包"},
                ],
                radius:"60%",
                
            },
    //画图
    series: [
        {
            type: "radar", 
            // roseType:"radius",//是否展示成南丁格尔图，通过半径区分数据大小
            itemStyle: {
                borderRadius:1,
                color: (params) => {
                    //自定义颜色
                    const colorList = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];
                    return colorList[params.dataIndex];
                }
            },
            data:[
                {
                    value: [400, 400, 400, 400, 400, 400],
                    name:"预定数量"
                },
                {
                    value: [300, 300, 300, 300, 300, 300],
                    name:"下单数量"
                },
                {
                    value: [200, 200, 200, 200, 200, 200],
                    name:"发货数量"
                }
            ]
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