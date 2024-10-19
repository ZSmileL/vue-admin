<template>
    <el-card shadow="never" :body-style="{ padding: '20px' }">
        <template #header>
        <div class="card-header">
            <span>业绩柱状图</span>
            <DownLoadChart chartName="业绩柱状图" v-if="chart" :chart="chart"></DownLoadChart>
        </div>
        </template>
        <div :id="id" :style="{width:width,height:height}"></div>
    </el-card>
    
</template>

<script setup>
import {ref, onMounted, markRaw } from 'vue'
import DownLoadChart from './DownLoadChart.vue';
import * as echarts from "echarts"
const chart = ref("");
const props = defineProps({
    id:{
        type:String,
        required:true,
        default: "barChart",
    },
    width:{
        type:String,
        default:"200px",
        required:true,
    },
    height:{
        type:String,
        default:"200px",
        required:true
    }
})
//柱状图配置
const options = {
    grid:{
        left:"2%",
        right:"2%",
        bottom:"10%",
        containLabel:true,
    },
    tooltip:{
        trigger:"axis",
        axisPointer: {
            type:"cross",
            crossStyle:{
                color:"#999",
            }
        }
    },
    legend:{
        x:"center",
        y:"bottom",
        data:["收入","毛利润","收入增长率","利润增长率"],
        textStyle:{
            color:"#999",
        },
    },
    //横坐标
    xAxis:[
        {
            type:'category',
            data:["重庆","北京","上海","成都","深圳"],
            axisPointer:{
                type:"shadow",
            }
        }
    ],
    //纵坐标
    yAxis:[
        {
            type:"value",
            min:0,
            max:10000,
            interval:2000,
            axisLabel:{
                formatter:"{value}",
            },
        },
        {
            type:"value",
            min:0,
            max:100,
            interval:20,
            axisLabel:{
                formatter:"{value}%",
            },
        }
    ],
    //画图
    series:[
        {
            name:"收入",
            type:"bar",
            data:[7000,7100,7200,7300,7400],
            barWidth:20,
            itemStyle:{
                color: new echarts.graphic.LinearGradient(0,0,0,1,[
                    {offset:0,color:"#83bff6"},
                    {offset:0.5,color:"#188df0"},
                    {offset:1,color:"#188df0"}
                ])
            }
        },
        {
            name:"毛利润",
            type:"bar",
            data:[8000,8200,8400,8600,8800],
            barWidth:20,
            itemStyle:{
                color: new echarts.graphic.LinearGradient(0,0,0,1,[
                    {offset:0,color:"#25d73c"},
                    {offset:0.5,color:"#1bc23d"},
                    {offset:1,color:"#179e61"}
                ])
            }
        },
        {
            name:"收入增长率",
            type:"line",
            data:[60,65,70,75,80],
            yAxisIndex:1,
            itemStyle:{
                color: "#67C23A",
            }
        },
        {
            name:"利润增长率",
            type:"line",
            data:[70,75,80,85,90],
            yAxisIndex:1,
            itemStyle:{
                color: "#409EFF",
            }
        }
    ]
}

onMounted(()=>{
    //图标初始化
    chart.value = markRaw(
        echarts.init(document.getElementById(props.id))
    )
    chart.value.setOption(options);
})
</script>

<style lang="scss" scoped>
.card-header{
    font-size: 16px;
    display: flex;
    justify-content: space-between;

}
</style>