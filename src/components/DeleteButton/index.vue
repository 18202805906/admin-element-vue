<template>
  <el-button
    type="danger"
    icon="el-icon-delete"
    plain
    size="mini"
    v-bind="$attrs"
    v-on="$listeners"
    @click="handleClick"
  >
    <slot>删除</slot>
  </el-button>
</template>

<script>
export default {
  name: 'delete-button',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$msgbox({
        title: '提示',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        message: this.title
          ? `<span>您确定要删除【<span class="text-primary">${this.title}</span>】吗？</span>`
          : '您确定要删除该数据吗？'
      }).then(() => this.$emit('confirm'));
    }
  }
};
</script>
