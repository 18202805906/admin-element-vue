<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <span class="flex" style="justify-content: flex-end">
        <el-input
          v-model="searchWord"
          clearable
          placeholder="请输入动作名称"
          style="width: 200px; margin-right: 10px"
        />
        <el-select placeholder="请选择日志类型" style="width: 150px" v-model="searchType">
          <el-option :value="key" v-for="(item, key) in logType" :key="key" :label="item"> </el-option>
        </el-select>
        <el-date-picker
          type="daterange"
          format="yyyy-MM-DD"
          style="width: 300px; margin: 0 10px"
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
        :pagination.sync="pagination"
        @page-change="getData"
        v-loading="tableLoading"
      >
        <el-table-column prop="name" label="动作" align="center"> </el-table-column>
        <el-table-column prop="type" label="类型" align="center" width="150">
          <template slot-scope="{ row }">
            {{ logType[row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作者" width="150"> </el-table-column>
        <el-table-column prop="path" label="接口地址"> </el-table-column>
        <el-table-column prop="createTime" label="时间" align="center" width="200"> </el-table-column>
        <el-table-column type="action" label="操作" width="200" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleView(row)" type="primary" icon="el-icon-view" plain size="mini">详情</el-button>
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <el-dialog title="详情" :visible.sync="isShowDetail" width="520px">
      <el-form label-width="80px" class="detail-form">
        <el-form-item label="动作:">
          <span class="field-text">{{ detail.name }}</span>
        </el-form-item>
        <el-form-item label="类型:">
          <span class="field-text">{{ logType[detail.type] }} ( {{ detail.type }} )</span>
        </el-form-item>
        <el-form-item label="操作者:">
          <span class="field-text">{{ detail.username }}</span>
        </el-form-item>
        <el-form-item label="时间:">
          <span class="field-text">{{ detail.createTime }}</span>
        </el-form-item>
        <el-form-item label="接口地址:">
          <span class="field-text">{{ detail.path }}</span>
        </el-form-item>
        <el-form-item label="参数:">
          <el-input class="field-text" type="textarea" readonly :rows="2" :value="detail.parameters"></el-input>
        </el-form-item>
        <el-form-item label="返回结果:">
          <el-input class="field-text" type="textarea" readonly :rows="3" :value="detail.result"></el-input>
        </el-form-item>
      </el-form>
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
      tableData: [],
      tableLoading: false,
      pagination: {
        ...this.$pagination,
        pageSize: 10
      },
      searchWord: '',
      searchType: '',
      searchTimes: [],
      isShowDetail: false,
      detail: {}
    };
  },
  created() {
    this.getData(1);
  },
  methods: {
    getData(pageNow = 1) {
      this.tableLoading = true;
      logApi
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
      this.searchWord = '';
      this.searchType = '';
      this.searchTimes = [];
      this.getData(1);
    },
    handleView(row) {
      console.log(row);
      this.detail = { ...row };
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