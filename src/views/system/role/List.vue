<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <span class="fl">
        <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd">新建 </el-button>
      </span>
      <span class="flex" style="justify-content: flex-end">
        <el-input v-model="searchWord" clearable placeholder="请输入角色名称" style="width: 300px; margin-right: 10px">
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
        <el-table-column prop="title" label="名称"> </el-table-column>
        <el-table-column prop="code" label="编码" width="200"> </el-table-column>
        <el-table-column prop="deptName" label="部门" width="200"> </el-table-column>
        <el-table-column prop="describe" label="描述"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column type="action" label="操作" width="320" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleEdit(row)" type="primary" icon="el-icon-edit" plain size="mini">编辑</el-button>
            <el-button @click="handleAuth(row)"  icon="el-icon-bangzhu" plain size="mini">授权</el-button>
            <delete-button @confirm="handleDel(row)" :title="row.title" />
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <!-- 新增和编辑 -->
    <el-dialog :visible.sync="isShowEdit" :title="isAdd ? '新建' : '编辑'" width="520px" @close="handleClose">
      <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="所属部门" prop="selectDept">
          <el-cascader
            class="width-full"
            ref="cascader"
            :options="deptList"
            :props="{ label: 'title', value: 'code', children: 'children'}"
            v-model="selectDept"
            placeholder="请选择所属部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input type="textarea" v-model="form.describe" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权  -->
    <auth-menu-modal :show.sync="isShowAuth" v-model="selectAuth" @confirm="handleSetAuth"></auth-menu-modal>
  </div>
</template>

<script>
import AuthMenuModal from './components/AuthMenuModal.vue';
import roleApi from '@/api/system/role';
import departmentApi from '@/api/system/department';
const initForm = {
  title: '',
  code: '',
  deptName: '',
  deptId: 0,
  deptCode: 0,
  describe: ''
};
export default {
  inject: ['$pagination'],
  components: { AuthMenuModal },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      pagination: {
        ...this.$pagination,
        pageSize: 10
      },
      searchWord: '',
      deptList: [],
      selectDept: [],
      isShowEdit: false,
      isAdd: true,
      form: {},
      rules: {
        title: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
        code: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
        deptId: [{ required: true, trigger: 'blur', message: '请选择所属部门' }]
      },
      isShowAuth: false,
      editRow: {},
      selectAuth: []
    };
  },
  created() {
    this.getData(1);
    this.getDeptList();
  },
  methods: {
    getData(pageNow = 1) {
      this.tableLoading = true;
      roleApi
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
    getDeptList() {
      departmentApi
        .list({
          pageSize: 10000,
          pageNow: 1
        })
        .then((res) => {
          console.log(res);
          this.deptList = res.list;
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
    handleAuth(row) {
      console.log(row);
      this.isShowAuth = true;
      this.editRow = {...row};
    },
    handleSetAuth(keys){
      console.log(keys);
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
      this.selectDept=[];
      this.isShowEdit = false;
    },
    handleOk() {
      let selectNode = this.$refs.cascader.getCheckedNodes(true)[0];
      let selectData = selectNode ? selectNode.data : {};
      this.form.deptId = selectData.id;
      this.form.deptCode = selectData.code;
      this.form.deptName = selectData.title;
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
