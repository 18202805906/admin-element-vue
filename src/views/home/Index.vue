<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
    <h5>上传示例</h5>
    <upload-demo></upload-demo>
    <h5>查询示例</h5>
    <query-demo></query-demo>
    </el-card>
  </div>
</template>

<script>
import queryDemo from '@/views/demo/queryDemo.vue';
import UploadDemo from '@/views/demo/uploadDemo.vue';
export default {
  name: 'home',
  components:{
    queryDemo,
    UploadDemo
  },
  data(){
    return{
    };
  },
  methods: {}
};
</script>
