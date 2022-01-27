<template>
      <t-calendar
    v-on:choseDay="clickDay"
    v-on:changeMonth="changeDate"
    v-on:dblclickDay="dblclickDay"
  ></t-calendar>
</template>
  <script>
  export default {
    data() {
        return {
        };
    },
    methods:{
        clickDay(data) {
      console.log(data); //选中某天
    },
    changeDate(data) {
      console.log(data); //左右点击切换月份
    },
    clickToday(data) {
      console.log(data); // 跳到了本月
    },
    dblclickDay(data) {
      console.log(data); // 当前日期对象
    }
    }
  };
  </script> 

<style scoped lang="scss">
.echarts {
  height: 130px;
}
</style>