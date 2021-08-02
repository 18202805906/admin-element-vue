<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <span class="fl">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">新建 </el-button>
      </span>
      <span class="flex" style="justify-content: flex-end">
        <el-input
          v-model="searchWord"
          clearable
          placeholder="请输入配置项名称"
          style="width: 300px; margin-right: 10px"
        >
        </el-input>
        <el-button class="space" icon="search" type="primary" @click="handleSearch">搜索</el-button>
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
        <el-table-column prop="code" label="代码" width="100"> </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template slot-scope="{row}">
            {{ row.type | configType }}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="配置值" width="100"> </el-table-column>
        <el-table-column prop="describe" label="说明">
          <template slot-scope="{ row }">
            <el-tooltip :content="row.describe">
              <div class="text-nowrap">{{ row.describe }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="200"> </el-table-column>
        <el-table-column type="action" label="操作" width="220" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleEdit(row)" type="primary" icon="el-icon-edit" plain size="mini">编辑</el-button>
            <delete-button @confirm="handleDel(row)" :title="row.title" />
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <!-- 新增编辑 -->
    <el-dialog :visible.sync="isShowEdit" :title="isAdd ? '新建' : '编辑'" width="520px" @close="handleClose">
      <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="配置项代码" prop="code">
          <el-input v-model="form.code" :disabled="!isAdd" />
        </el-form-item>
        <el-form-item label="配置项名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="配置项类型" prop="type">
          <el-select v-model="form.type" class="width-full">
            <el-option :value="item.value" v-for="item in types" :key="item.value" :label="item.title"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置项值" prop="value">
          <component :is="configComponent" v-model="form.value"></component>
        </el-form-item>
        <el-form-item label="说明" prop="describe">
          <el-input type="textarea" :rows="4" v-model="form.describe" />
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
import configComponent from './components';
import configApi from '@/api/system/config';
const initForm = {
  code: '',
  title: '',
  value: '',
  type: configComponent[0].value,
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
      types: configComponent,
      isShowEdit: false,
      isAdd: true,
      form: {},
      rules: {
        title: [{ required: true, trigger: 'blur', message: '请输入配置项名称' }],
        code: [{ required: true, trigger: 'blur', message: '请输入配置项代码' }],
        value: [{ required: true, trigger: 'blur', message: '请输入配置项值' }],
        type: [{ required: true, trigger: 'blur', message: '请选择配置类型' }]
      }
    };
  },
  created() {
    this.getData(1);
  },
  computed: {
    configComponent() {
      const type = configComponent.find((item) => item.value === Number(this.form.type));
      return type?.component;
    }
  },
  filters: {
    configType(val) {
      const type = configComponent.find((item) => item.value === Number(val));
      return type.title;
    }
  },
  methods: {
    getData(pageNow=1) {
      this.tableLoading = true;
      configApi
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
