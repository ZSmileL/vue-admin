<template>
    <div class="dashboard-container">
        <!-- greeting -->
        <div class="greeting-panel">
            <div class="greeting-left">
                <img :src="userStore.user.avatar" alt="" class="avatar">
                <div class="greeting-info">
                    {{ greeting }}
                    <p class="weather">
                        今日天气晴朗，气温在15℃至25℃之间，东南风。
                    </p>
                </div>
            </div>
            <div class="greeting-right">
                <el-statistic :value="99">
                    <template #title>
                        <SvgIcon size="20px" iconClass="message"></SvgIcon>
                        消息
                    </template>
                </el-statistic>
                <el-statistic :value="50">
                    <template #title>
                        <SvgIcon size="20px" iconClass="todolist"></SvgIcon>
                        待办
                    </template>
                    <template #suffix>/100</template>
                </el-statistic>
                <el-statistic :value="10">
                    <template #title>
                        <SvgIcon size="20px" iconClass="project"></SvgIcon>
                        项目
                    </template>
                </el-statistic>
            </div>
        </div>
        <!-- 数据卡片 -->
        <div class="data-card">
            <el-card shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>访客数</span>
                        <el-tag type="success">
                            日
                        </el-tag>
                        
                    </div>
                </template>
                <div class="data-info">
                    2000
                    <SvgIcon iconClass="visit" size="32px"></SvgIcon>
                </div>
                <div class="data-info data-info-total">
                    <p>总访客数</p>
                    <p>30000</p>
                </div>
                
            </el-card>
            <el-card shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>IP数</span>
                        <el-tag type="success">
                            日
                        </el-tag>
                        
                    </div>
                </template>
                <div class="data-info">
                    2000
                    <SvgIcon iconClass="ip" size="32px"></SvgIcon>
                </div>
                <div class="data-info data-info-total">
                    <p>总IP数</p>
                    <p>2000</p>
                </div>
                
            </el-card>
            <el-card shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>销售额</span>
                        <el-tag type="primary">
                            月
                        </el-tag>
                        
                    </div>
                </template>
                <div class="data-info">
                    2000
                    <SvgIcon iconClass="money" size="32px"></SvgIcon>
                </div>
                <div class="data-info data-info-total">
                    <p>总销售额</p>
                    <p>30000</p>
                </div>
                
            </el-card>
            <el-card shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>订单量</span>
                        <el-tag type="danger">
                            季
                        </el-tag>
                        
                    </div>
                </template>
                <div class="data-info">
                    2000
                    <SvgIcon iconClass="order" size="32px"></SvgIcon>
                </div>
                <div class="data-info data-info-total">
                    <p>总订单量</p>
                    <p>2000</p>
                </div>
                
            </el-card>
        </div>
        <!-- 图表 -->
        <div class="echarts">
            <BarChart class="echart" id="barchar" height="400px" width="100%"></BarChart>
            <PieChart class="echart" id="piechart" height="400px" width="100%"></PieChart>
            <RadarChart class="echart" id="radarchart" height="400px" width="100%"></RadarChart>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
import RadarChart from './components/RadarChart.vue';
const userStore = useUserStore();
//招呼语
const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 8) {
        return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
    } else if (hour >= 8 && hour < 12) {
        return "上午好，" + userStore.user.nickname + "！";
    } else if (hour >= 12 && hour < 18) {
        return "下午好，" + userStore.user.nickname + "！";
    } else if (hour >= 18 && hour < 24) {
        return "晚上好，" + userStore.user.nickname + "！";
    } else if (hour >= 0 && hour < 6) {
        return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
    }
})
</script>

<style lang="scss" scoped>
.dashboard-container {
    width: 100%;
    padding: 24px;

    .greeting-panel {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        padding: 20px;

        .greeting-left {
            display: flex;
            align-items: center;

            .avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-right: 20px;
            }

            .greeting-info {
                font-size: 16px;

                .weather {
                    margin-top: 20px;
                    color: #9cA3AF;
                    font-size: 14px;
                }
            }
        }

        .greeting-right {
            max-width: 25%;
            flex: 0 0 25%;
            display: flex;
            align-items: center;
            justify-content: space-around;

            :deep(.el-statistic__head) {
                font-size: 16px;
                display: flex;
                margin-right: 20px;
                margin-bottom: 10px;
            }
        }
    }
    .data-card{
        width: 100%;
        display: flex;
        font-size: 16px;
        margin-top: 20px;
        :deep(.el-card){
            flex: 1;
            margin-left: 5px;
            margin-right: 5px;
            &:nth-child(1){
                margin-left: 0;
            }
            &:nth-last-child(1){
                margin-right: 0;
            }
        }
        .card-header{
            display: flex;
            justify-content: space-between;
        }
        .data-info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            margin: 20px 5px;
            &.data-info-total{
                font-size: 14px;
                color:#9cA3AF;
                margin-top: 0;
                margin-bottom: 0;
            }
        }
    }
    .echarts{
        display: flex;
        width: 100%;
        margin-top: 20px;
        .echart{
            flex: 1;
            margin-left: 5px;
            margin-right: 5px;
            &:nth-child(1){
                margin-left: 0;
            }
            &:nth-last-child(1){
                margin-right: 0;
            }
        }
    }
}
</style>