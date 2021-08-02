<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <span class="fl">
        <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd">新建 </el-button>
      </span>
      <span class="flex" style="justify-content: flex-end">
        <el-input v-model="searchUsername" placeholder="用户名" clearable style="width: 200px" />
        <el-input
          v-model="searchEmail"
          placeholder="电子邮箱"
          clearable
          style="width: 200px; margin-left: 10px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" plain @click="handleReset">重置</el-button>
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
        row-key="id"
      >
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="nickname" label="昵称"> </el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="200"> </el-table-column>
        <el-table-column prop="roleName" label="角色"> </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === 0" type="success" size="mini" effect="plain">{{
              userStatus[row.status]
            }}</el-tag>
            <el-tag v-else-if="row.status === 1" type="warning" size="mini" effect="plain">{{
              userStatus[row.status]
            }}</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger" size="mini" effect="plain">{{
              userStatus[row.status]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" align="center"> </el-table-column>
        <el-table-column type="action" label="操作" width="320" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleEdit(row)" type="primary" icon="el-icon-edit" plain size="mini">编辑</el-button>
            <delete-button @confirm="handleDel(row)" :title="row.username" />
            <el-dropdown @command="(key) => handleMoreAction(key, row)" szie="mini" style="margin-left: 10px">
              <el-button plain size="mini">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="lock" icon="el-icon-lock" v-if="row.status !== 1">锁定账号</el-dropdown-item>
                <el-dropdown-item command="unlock" icon="el-icon-unlock" v-if="row.status === 1"
                  >解锁账号</el-dropdown-item
                >
                <el-dropdown-item command="reset" icon="el-icon-refresh-left">重置密码</el-dropdown-item>
                <el-dropdown-item command="role" icon="el-icon-user">设置角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <!-- 新增编辑 -->
    <el-dialog :visible.sync="isShowEdit" :title="isAdd ? '新建' : '编辑'" width="720px" @close="handleClose">
      <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="!isAdd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idCard">
              <el-input v-model="form.idCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel"> <el-input v-model="form.tel"> </el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email"> <el-input v-model="form.email"> </el-input> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="所属部门" prop="deptId">
              <el-cascader
                class="width-full"
                ref="cascader"
                :options="deptList"
                :props="{ label: 'title', value: 'code', children: 'children' }"
                v-model="selectDept"
                placeholder="请选择所属部门"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="描述" prop="describe">
              <el-input type="textarea" :rows="4" v-model="form.describe" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置角色 -->
    <el-dialog :visible.sync="isShowRole" title="设置角色" width="520px" @close="selectRole = []">
      <el-select v-model="selectRole" multiple placeholder="请选择角色" style="width: 100%">
        <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.title"></el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="isShowRole=false">取 消</el-button>
        <el-button type="primary" @click="handleSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { USER_STATUS } from '@/config/dictionary';
import userApi from '@/api/system/user';
import departmentApi from '@/api/system/department';
import roleApi from '@/api/system/role';
const initForm = {
  username: '',
  name: '',
  nickname: '',
  email: '',
  idCard: '',
  deptId: '',
  tel: '',
  describe: ''
};
export default {
  inject: ['$pagination'],
  data() {
    return {
      searchUsername: '',
      searchEmail: '',
      tableData: [],
      tableLoading: false,
      pagination: {
        ...this.$pagination,
        pageSize: 10
      },
      userStatus: USER_STATUS,
      deptList: [],
      selectDept: [],
      isShowEdit: false,
      isAdd: true,
      form: {},
      rules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }]
      },
      isShowRole: false,
      roleList: [],
      selectRole: []
    };
  },
  created() {
    this.getData(1);
    this.getDeptList();
    this.getRoleList();
  },
  methods: {
    getData(pageNow = 1) {
      this.tableLoading = true;
      userApi
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
    getRoleList() {
      roleApi
        .list({
          pageSize: 10000,
          pageNow: 1
        })
        .then((res) => {
          console.log(res);
          this.roleList = res.list;
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
    handleMoreAction(key, row) {
      let methodMap = {
        lock: this.handleLock,
        unlock: this.handleUnlock,
        reset: this.handleResetPwd,
        role: this.handleSelectRole
      };
      methodMap[key] && methodMap[key](row);
    },
    handleLock(row) {
      this.$confirm('您确定要锁定该用户吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('操作成功');
      });
    },
    handleUnlock(row) {
      this.$message.success('操作成功');
    },
    handleResetPwd(row) {
      this.$confirm('您确定要重置该用户的密码吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('操作成功');
      });
    },
    handleSelectRole(row) {
      this.isShowRole = true;
    },
    handleDel(row) {
      console.log(row);
      this.$message.success('操作成功');
    },
    handleSearch(key) {
      console.log(key);
      this.getData(1);
    },
    // 重置
    handleReset() {
      this.searchUsername = '';
      this.searchEmail = '';
      this.getData(1);
    },
    handleClose() {
      this.$refs.editForm.resetFields();
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
    },
    handleSetRole() {
      this.$message.success('操作成功');
      this.isShowRole = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 400px;
  height: 400px;
  overflow-y: auto;
}
</style>
