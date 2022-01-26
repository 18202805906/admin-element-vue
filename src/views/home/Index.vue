<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
    <h5>上传示例</h5>
    <upload-demo></upload-demo>
    <h5>查询示例</h5>
    <query-demo></query-demo>
    <h5>表单示例</h5>
    <form-demo></form-demo>
    </el-card>
  </div>
</template>

<script>
import queryDemo from '@/views/demo/queryDemo.vue';
import UploadDemo from '@/views/demo/uploadDemo.vue';
import FormDemo from '@/views/demo/formDemo.vue';
export default {
  name: 'home',
  components:{
    queryDemo,
    UploadDemo,
    FormDemo
  },
  data(){
    return{
    };
  },
  methods: {}
};
</script>
