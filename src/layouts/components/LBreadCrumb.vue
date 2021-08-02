<template>
  <div class="breadcrumb-bar">
    <i class="trigger" :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="handleCollapse" />
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item
        ><i theme="filled" class="home-ico el-icon-s-home" /><router-link to="/">首页</router-link></el-breadcrumb-item
      >
      <el-breadcrumb-item v-for="item in data" :key="item.id"
        ><router-link :to="item.url">{{ item.title }}</router-link></el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCollapse() {
      this.$emit('update:collapse', !this.collapse);
    }
  }
};
</script>
<style lang="scss" scoped>
.breadcrumb-bar {
  display: flex;
  width: 100%;
  background-color: #fff;
  align-items: center;
}
.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  color: #999;
  padding: 0 10px;
  &:hover {
    color: #333;
  }
}
.breadcrumb {
  padding: 0 10px;
  background-color: #fff;
  line-height: 48px;
  .home-ico {
    color: #d1e9ff;
    margin-right: 8px;
  }
}
</style>