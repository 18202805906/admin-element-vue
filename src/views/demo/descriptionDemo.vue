<template>
    <div>
      <!-- 除了descData之外其他配置与element-ui中的配置相同 -->
      <t-description
      direction="vertical"
      :descData="data"
      border
      size="small"
      :column="4"
      title="详情框"
      >
        <!-- 模块detail详情content内容插槽 -->
          <template #btn>
            <el-button type="danger">自定义模块detail插槽</el-button>
          </template>
        <!-- 模块detail详情content内容插槽 -->
          <template #tag>
            <el-tag size="small">测试</el-tag>
          </template>
          <!-- 模块detail详情label插槽,使用作用域插槽获取子组件数据 -->
          <template #goodsSlot="scope" >
            <i class="el-icon-user"></i>{{scope.label}}
          </template>
          <template #total >
            <span :style="{color:'red'}">总件数</span>
          </template>
          <!-- 模块detail详情content内容插槽,也可通过作用域插槽获取value -->
          <template #pic="scope">
            <img :src="scope.value" width="20px">
          </template>
      </t-description>
    </div>
</template>

<script>
export default {
    name: 'descriptionDemo',
    data(){
      return {
        // 对象中valueSlotName设置具名插槽，自定义value显示
        // tooltip 用于value提示，span设置占用column数
        // 对象中labelSlotName设置作用域插槽，自定义label显示
        data: [
            {
              label: '货物名称',
              value: '111',
              labelSlotName: 'goodsSlot'
            },
            {
              label: '货品按钮',
              value: '',
              valueSlotName: 'btn',
            },
            {
              label: '货品价值',
              value: '$1000',
              tooltip: '货物价值提示'
            },
            {
              label: '图片',
              value: require('../../assets/images/logo.png'),
              valueSlotName: 'pic'
            },
            {
              label: '总体积',
              value: ''
            },
            {
              label: '总件数',
              value: '100',
              labelSlotName: 'total'
            },
            {
              label: '易碎品',
              value: '3333',
              valueSlotName: 'tag',
              span: 2
            },
            {
              label: '备注',
              value: '占位一整行777777777777777777777777777777',
              span: 4
            }
    ]
      };
    }
      
};
</script>