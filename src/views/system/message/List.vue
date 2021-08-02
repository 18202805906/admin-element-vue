<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <span class="fl">
        <el-button type="primary" plain icon="el-icon-check" @click="handleAllRead">全部已读</el-button>
        <el-button type="primary" plain icon="el-icon-finished" @click="handleBatchRead">批量已读</el-button>
      </span>
      <span class="flex" style="justify-content: flex-end">
        <el-select placeholder="消息类型(可选)" style="width: 15%" v-model="searchType">
          <el-option v-for="(item, key) in messageType" :key="key" :value="item" :label="item"></el-option>
        </el-select>
        <el-select placeholder="消息状态(可选)" style="width: 15%; margin: 0 10px" v-model="searchStatus">
          <el-option v-for="(item, key) in messageStatus" :key="key" :value="item" :label="item"></el-option>
        </el-select>
        <el-date-picker
          type="daterange"
          format="yyyy-MM-DD"
          style="width: 28%; margin-right: 10px"
          v-model="searchTimes"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" plain @click="handleReset">重置</el-button>
      </span>
    </el-card>
    <el-card shadow="never">
      <basis-table
        ref="table"
        :data="tableData"
        size="mini"
        border
        show-index
        selection
        :pagination.sync="pagination"
        @page-change="getData"
        @selection-change="onSelectionChange"
        v-loading="tableLoading"
      >
        <el-table-column prop="sender" label="发送者" width="150" align="center"> </el-table-column>
        <el-table-column prop="type" label="类型" align="center" width="150">
          <template slot-scope="{ row }">
            {{ messageType[row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column prop="state" label="状态" align="center" width="150">
          <template slot-scope="{ row }">
            <el-tag v-if="row.state === 0" type="danger" size="mini" effect="plain">{{
              messageStatus[row.state]
            }}</el-tag>
            <el-tag v-if="row.state === 1" type="info" size="mini" effect="plain">{{
              messageStatus[row.state]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发送时间" align="center" width="200"> </el-table-column>
        <el-table-column type="action" label="操作" width="220" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleView(row)" type="primary" icon="el-icon-view" plain size="mini">详情</el-button>
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <el-dialog title="消息详情" :visible.sync="isShowDetail" width="520px">
      <p>{{ detail.content }}</p>
      <div slot="footer" class="text-center">
        <el-button type="primary" icon="el-icon-check" @click="isShowDetail = false">已 读</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import messageApi from '@/api/system/message';
import { MESSAGE_TYPE, MESSAGE_STATUS } from '@/config/dictionary';
export default {
  inject: ['$pagination'],
  data() {
    return {
      messageType: MESSAGE_TYPE,
      messageStatus: MESSAGE_STATUS,
      tableData: [],
      tableLoading: false,
      pagination: {
        ...this.$pagination,
        pageSize: 10
      },
      searchType: '',
      searchStatus: '',
      searchTimes: [],
      isShowDetail: false,
      detail: {},
      selectedRows: []
    };
  },
  mounted() {
    this.getData(1);
  },
  methods: {
    getData(pageNow = 1) {
      this.tableLoading = true;
      messageApi
        .list({
          pageSize: this.pagination.pageSize,
          pageNow
        })
        .then((res) => {
          console.log(res);
          this.pagination.currentPage = res.current;
          this.pagination.total = res.total;
          this.tableData = res.list;
          this.tableLoading = false;
        });
    },
    // 查询
    handleSearch() {
      this.getData(1);
    },
    // 重置
    handleReset() {
      this.searchType = '';
      this.searchStatus = '';
      this.searchTimes = [];
      this.getData(1);
    },
    // 详情
    handleView(row) {
      this.detail = { ...row };
      this.isShowDetail = true;
    },
    onSelectionChange(data) {
      this.selectedRows = data;
    },
    // 全部已读
    handleAllRead() {
      this.$confirm('确定把所有未读消息标记为已读吗?', {
        title: '提示',
        type: 'warning'
      }).then(() => {
        this.$message.success('操作成功');
      });
    },
    // 批量已读
    handleBatchRead() {
      if (!this.selectedRows.length) {
        return this.$message.error('未选择操作数据');
      }
      this.$confirm('确定把选择项标记为已读吗?', {
        type: 'warning',
        title: '提示'
      }).then(() => {
        this.$refs.table.getTable().clearSelection();
        this.$message.success('操作成功');
      });
    }
  }
};
</script>
