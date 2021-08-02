<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <span class="fl">
        <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd">新建 </el-button>
      </span>
      <span class="flex" style="justify-content: flex-end">
        <el-input
          v-model="searchWord"
          clearable
          placeholder="请输入部门名称"
          style="width: 300px; margin-right: 10px"
        >
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </span>
    </el-card>
    <el-card shadow="never">
      <basis-table
        :data="tableData"
        size="mini"
        border
        show-index
        :pagination.sync="pagination"
        @page-change="getData"
        v-loading="tableLoading"
      >
        <el-table-column prop="title" label="部门名称"> </el-table-column>
        <el-table-column prop="code" label="部门编码" width="200"> </el-table-column>
        <el-table-column prop="describe" label="部门描述"> </el-table-column>
        <el-table-column type="action" label="操作" width="220" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleEdit(row)" type="primary" icon="el-icon-edit" plain size="mini">编辑</el-button>
            <delete-button @confirm="handleDel(row)" :title="row.title"/>
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <!-- 新增和编辑 -->
    <el-dialog :visible.sync="isShowEdit" :title="isAdd ? '新建' : '编辑'" width="520px" @close="handleClose">
      <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item  label="部门名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item  label="部门编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item  label="描述" prop="describe">
          <el-input type="textarea" v-model="form.describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import departmentApi from '@/api/system/department';
const initForm = {
  title: '',
  code: '',
  describe: ''
};
export default {
  inject: ['$pagination'],
  data() {
    return {
      tableData: [],
      tableLoading: false,
      pagination: {
        ...this.$pagination,
        pageSize: 10
      },
      searchWord: '',
      isShowEdit: false,
      isAdd: true,
      form: {},
      rules: {
        title: [{ required: true, trigger: 'blur', message: '请输入部门名称' }],
        code: [{ required: true, trigger: 'blur', message: '请输入部门编码' }]
      }
    };
  },
  created() {
    this.getData(1);
  },
  methods: {
    getData(pageNow=1) {
      this.tableLoading = true;
      departmentApi
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
    handleAdd() {
      this.isAdd = true;
      this.isShowEdit = true;
      this.form = { ...initForm };
    },
    handleEdit(row) {
      console.log(row);
      this.isAdd = false;
      this.isShowEdit = true;
      this.form = { ...row };
    },
    handleDel(row) {
      console.log(row);
      this.$message.success('操作成功');
    },
    handleSearch(key) {
      console.log(key);
      this.getData(1);
    },
    handleClose() {
      this.$refs.editForm.resetFields();
      this.isShowEdit = false;
    },
    handleOk() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$message.success('操作成功');
          this.handleClose();
        }
      });
    }
  }
};
</script>
