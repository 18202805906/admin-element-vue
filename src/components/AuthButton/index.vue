<template>
  <el-button v-bind="$attrs" v-on="$listeners" v-if="hasAuth">
    <slot></slot>
  </el-button>
</template>

<script>
import {getStorage} from '@/utils/storage';
export default {
  // inheritAttrs:false,
  data() {
    return {
      permissions: Object.freeze(getStorage('permissions'))
    };
  },
  props: {
    auth: {
      type: String,
      default: ''
    }
  },
  computed:{
    hasAuth(){
      const permissions = this.permissions||[];
      return !this.auth || permissions.includes(this.auth);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>