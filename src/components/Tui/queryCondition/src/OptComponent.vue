<template>
  <component
    :is="comp"
    v-bind="{clearable:true,filterable:true,...bind}"
    :placeholder="getPlaceholder(opt)"
    v-on="cEvent"
    :value="value"
  >
    <OptComponent v-for="(cOpt, i) in child" :key="i" v-bind="cOpt" :value="cOpt.value" />
  </component>
</template>
<script>
export default {
  name: 'OptComponent',
  props: {
    dataIndex: {
      type: String,
      default: ''
    },
    opt: {
      type: Object,
      default: () => ({})
    },
    bind: {
      type: Object,
      default: () => ({})
    },
    //事件
    event: {
      type: Object,
      default: () => ({})
    },
    // 组件
    comp: {
      type: [String, Object],
      default: ''
    },
    child: {
      type: Array,
      default: () => ([])
    },
    // 参数值
    value: {
      type: [String, Number, Array, Date],
      default: ''
    },
    changeEvent: {
      type: String,
      default: 'input'
    }
  },
  computed: {
    cEvent () {
      let event = { ...this.event };
      let changeEvent = {};
      if (this.changeEvent) {
        changeEvent[this.changeEvent] = (v) => {
          event[this.changeEvent] && event[this.changeEvent](v, arguments);
          this.$emit('change', v, this.dataIndex, arguments);
        };
      }
      return { ...event, ...changeEvent };
    }
  },
  methods: {
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder;
      if (row.comp) {
        if (row.comp.includes('input')) {
          placeholder = '请输入' + row.label;
        } else if (row.comp.includes('select') || row.comp.includes('date')) {
          placeholder = '请选择' + row.label;
        } else {
          placeholder = row.label;
        }
      }
      return placeholder;
    }
  }
};
</script>
