<template>
  <span>
    <el-input :value="value" v-if="isEdit" @input="handleInput"  v-bind="$attrs" v-on="$listeners"/>
    <span v-else>{{ value }}</span>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: [String,Number],
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    }
  }
};
</script>
