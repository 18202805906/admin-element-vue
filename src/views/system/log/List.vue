<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <t-query-condition :opts="opts"   @submit="handleSearch" boolEnter/>
    </el-card>
    <el-card shadow="never">
      <t-table  
        :table="table" 
        border
        :columns="columns" 
        v-loading="tableLoading" 
        @page-change="pageChange"
        @size-change="sizeChange"
        isShowPagination
      >
      <!-- 自定义插槽 -->
      <template #type="{ scope }">{{ logType[scope.row.type] }}</template>
      </t-table>
    </el-card>
    <el-dialog title="详情" :visible.sync="isShowDetail" width="520px">
      <t-description
        :descData="descData"
        border
        size="small"
        :column="2"
        direction="vertical"
      >
        <template #type="scope">
              {{ logType[scope.value] }} ( {{ scope.value }} )
        </template>
      </t-description>
    </el-dialog>
  </div>
</template>

<script>
import { LOG_TYPE } from '@/config/dictionary';
import logApi from '@/api/system/log';
export default {
  inject: ['$pagination'],
  data() {
    return {
      logType: LOG_TYPE,
      // 表格配置
      table:{
        ...this.$pagination,
        firstColumn: { type: 'index', label: '序列' }, // 显示序列号
        data:[],
        // 表格内操作列
        operator: [
            {
              text: '详情',
              type: 'text',
              fun: this.handleView,
            },
          ],
          // 操作列样式
          operatorConfig: {
            fixed: 'right', // 固定列表右边（left则固定在左边）
            width: 100,
            label: '操作'
          }
      },
      columns: [
          { prop: 'name', label: '动作', minWidth: '150', sort: true },
          { prop: 'type', label: '类型', minWidth: '150'},
          { prop: 'username', label: '操作者', minWidth: '150'},
          { prop: 'path', label: '接口地址', minWidth: '200'},
          { prop: 'createTime', label: '时间', minWidth: '200'}
        ],
      // 查询配置
      opts:{
        searchWord: {
          label: '动作名称',
          comp: 'el-input',
          bind: {}
        },
        searchType: {
          label: '日志类型',
          comp: 'el-select',
          bind: {
          },
          child: Object.entries(LOG_TYPE).map((e) => {
            return {
              comp: 'el-option',
              value: e[0],
              bind: {
                label: e[1],
                key: e[0]
              }
            };
          })
        },
        searchTimes: {
          label: '日期范围',
          comp: 'el-date-picker',
          bind: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      },
      tableLoading: false,
      isShowDetail: false,
      descData: [],
      queryData:{}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tableLoading = true;
      logApi
        .list({
          pageSize: this.table.pageSize,
          pageNow: this.table.currentPage
        })
        .then((res) => {
          this.table.total = res.total;
          this.table.data = res.list;
          this.tableLoading = false;
        });
    },
    pageChange(current){
      this.table.currentPage = current;
      this.getData();
    },
    sizeChange(size){
      this.table.pageSize = size;
      this.getData();
    },
    // 查询
    handleSearch(data) {
      this.queryData = data;
      this.table.currentPage = 1;
      this.getData();
    },
    handleView(row) {
      this.descData = [];
      // 要显示的字段
      const showInfo = {
        'name': '动作',
        'type': '类型',
        'username': '操作者',
        'path': '接口地址',
        'createTime': '时间',
        'parameters': '参数',
        'result': '结果'
      };
       Object.entries(row).forEach(e =>{
        if(showInfo[e[0]]){
          let obj = {label: showInfo[e[0]], value: e[1]};
          if(e[0] === 'type') obj.valueSlotName='type';
          this.descData.push(obj);
        }
      });
      this.isShowDetail = true;
    }
  }
};
</script>
<style scoped>
.detail-form ::v-deep .el-form-item__label{
  color: #999;
}
</style>