<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
    <h5>上传示例</h5>
    <upload-demo></upload-demo>
    <h5>查询示例</h5>
    <query-demo></query-demo>
    <h5>表单示例</h5>
    <form-demo></form-demo>
    <h5>图表示例</h5>
    <echart-dmeo></echart-dmeo>
    </el-card>
  </div>
</template>

<script>
import queryDemo from '@/views/demo/queryDemo.vue';
import UploadDemo from '@/views/demo/uploadDemo.vue';
import FormDemo from '@/views/demo/formDemo.vue';
import EchartDmeo from '@/views/demo/echartDmeo.vue';
export default {
  name: 'home',
  components:{
    queryDemo,
    UploadDemo,
    FormDemo,
    EchartDmeo
  },
  data(){
    return{
    };
  },
  methods: {}
};
</script>
