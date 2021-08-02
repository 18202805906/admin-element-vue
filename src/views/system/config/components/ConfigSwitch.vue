<template>
  <span>
    <el-switch :value="value" :active-value="1" :inactive-value="0" @change="onChange" v-bind="$attrs" v-on="$listeners"/>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number,String],
      default: 0
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange(value) {
      this.$emit('input', value);
    }
  }
};
</script>
