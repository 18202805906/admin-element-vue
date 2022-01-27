// echart图
let echarts=require('echarts');

function bindEchartsF (el, binding) {
    const myChart = echarts.init(el);
    const option = binding.value || {};
    myChart.showLoading();
    myChart.setOption(option);
    myChart.hideLoading();
    myChart.on('click', (param)=>{
        return param;
    });
}
const bindEcharts = {
    deep: true,
    inserted (el, binding) {
        bindEchartsF(el, binding);
    },
    update (el, binding) {
        bindEchartsF(el, binding);
    }
};

export default bindEcharts;

  // 使用说明
  /* <template>
    <div class="echarts" v-bindEcharts="option"></div>
  </template>
  
  <script>
  export default {
    data() {
        return {
        option: {
            tooltip: {
            trigger: "axis",
            axisPointer: {
                // Use axis to trigger tooltip
                type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
            },
            },
            legend: {},
            legend: {
            data: ["大于1吨", "小于等于1吨"],
            left: 0,
            top: 10,
            //y: 'center',
            itemWidth: 15, // 设置图例图形的宽
            itemHeight: 8, // 设置图例图形的高
            textStyle: {
                color: "#4c9fcd", // 图例文字颜色
            },
            // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
            itemGap: 15,
            },
            grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
            },
            xAxis: {
            type: "value",
            axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                color: "#233653",
                },
            },
            axisLabel: {
                //坐标轴刻度标签的相关设置
                //   interval: 0,
                //   rotate: 60,
                textStyle: {
                color: "#7ec7ff",
                fontSize: 10,
                },
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            },
            yAxis: {
            type: "category",
            data: ['超载重量区间'],
            axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                color: "#233653",
                },
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            },
            series: [
            {
                name: "大于1吨",
                type: "bar",
                stack: "total",
                emphasis: {
                focus: "series",
                },
                data: [],
            },
            {
                name: "小于等于1吨",
                type: "bar",
                stack: "total",
                emphasis: {
                focus: "series",
                },
                data: [],
            }
            ],
        },
        };
    },
  }
  </script> 

<style scoped lang="scss">
.echarts {
  height: 130px;
}
</style>*/