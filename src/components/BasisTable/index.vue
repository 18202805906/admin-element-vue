<template>
  <div class="basic-table">
    <!-- 表格 -->
    <el-table v-bind="$attrs" v-on="$listeners" ref="table" :row-key="rowKey">
      <el-table-column type="selection" width="55" v-if="selection"></el-table-column>
      <el-table-column type="index" label="序号" width="80" v-if="showIndex" :index="computedIndex"> </el-table-column>
      <slot></slot>
    </el-table>
    <!-- 分页 -->
    <slot name="pagination">
      <el-pagination
        v-bind="pagination"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        @prev-click="onPrevClick"
        @next-click="onNextClick"
        v-if="pagination"
        class="basic-table-pagination"
      >
      </el-pagination>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'basis-table',
  props: {
    rowKey: {
      type: String,
      default: 'id'
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  methods: {
    getTable() {
      return this.$refs.table;
    },
    onSizeChange(params) {
      this.$emit('page-size-change', params);
    },
    onCurrentChange(params) {
      this.$emit('update:pagination',{
        ...this.pagination,
        currentPage: params
      });
      this.$emit('page-change', params);
    },
    onPrevClick(params) {
      this.$emit('page-prev-click', params);
    },
    onNextClick(params) {
      this.$emit('page-next-click', params);
    },
    computedIndex(index) {
      const { currentPage, pageSize } = this.pagination;
      return (currentPage - 1) * pageSize + index + 1;
    }
  }
};
</script>

<style scoped>
.basic-table-pagination {
  margin: 10px 0 0;
}
</style>