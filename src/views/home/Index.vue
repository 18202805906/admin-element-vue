<template>
  <div class="page-wrap">
    <h5>上传</h5>
    <t-upload-file
      @uploadSuccess="setFileId"
      @deleteSuccess="updateFileId"
      fileType=".jpg,.jpeg,.png,.pdf"
      setKey="bankAcctFileId"
    ></t-upload-file>

  </div>
</template>

<script>
export default {
  methods: {
    // 图片模块 上传后记录ids
    setFileId(data, key) {
      this[key] = data.res;
    },
    // 删除后更新ids
    updateFileId(data, key) {
      this[key] = data.res;
    }
  }
};
</script>
