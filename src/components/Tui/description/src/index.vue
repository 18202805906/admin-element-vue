
<template>
  <div>
    <el-descriptions  v-bind="$attrs">
          <el-descriptions-item
            v-for="(item, index) in descData"
            :key="index"
            :span="item.span || 1"
          >
            <template slot="label">
              <template v-if="item.labelSlotName" >
                <slot :name="item.labelSlotName" v-bind:label="item.label"></slot>
              </template>
              <span v-else>{{item.label}}</span>
            </template>
            <template v-if="item.valueSlotName">
              <slot :name="item.valueSlotName" v-bind:value="item.value"></slot>
            </template>
            <div v-else>
              <el-tooltip v-bind="$attrs" v-if="item.tooltip">
                <span>
                  {{ item.value }}
                  <i
                    :class="item.iconClass||'el-icon-warning-outline'"
                    style="cursor: pointer;"
                  />
                </span>
                <template #content v-if="item.tooltip">
                  <span v-if="typeof item.tooltip === 'string'">{{item.tooltip}}</span>
                  <template v-else-if="typeof item.tooltip === 'function'">
                    <render-tooltip :createElementFunc="item.tooltip" />
                  </template>
                </template>
              </el-tooltip>
              <span v-else>{{ item.value }}</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
  </div>
</template>
<script>
import RenderTooltip from './renderTooltip';
export default {
  name: 'TDescription',
  components: {
    RenderTooltip
  },
  props: {
    // 数据
    descData: {
      type: Array,
      default: () => ([])
    }
  },
};
</script>
