<template>
  <div class="page-wrap">
    <el-card class="page-control" shadow="never">
      <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd">新建 </el-button>
    </el-card>
    <el-card shadow="never">
      <basis-table :data="tableData" size="mini" border row-key="id">
        <el-table-column prop="name" label="菜单名字"> </el-table-column>
        <el-table-column prop="permission" label="权限标识" width="200"> </el-table-column>
        <el-table-column prop="icon" label="图标" width="200" align="center">
          <template slot-scope="{ row }">
            <i :class="row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="200" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.type === 0" type="info" size="mini" effect="plain">{{ menuType[row.type] }}</el-tag>
            <el-tag v-if="row.type === 1" type="success" size="mini" effect="plain">{{ menuType[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column type="action" label="操作" width="380" align="center">
          <template slot-scope="{ row }">
            <el-button @click="handleEdit(row)" type="primary" size="mini" plain icon="el-icon-edit">编辑</el-button>
            <el-button @click="handleAddChild(row)" type="primary" size="mini" plain icon="el-icon-plus"
              >添加子项</el-button
            >
            <el-button
              @click="handleHide(row, true)"
              type="primary"
              v-if="!row.hide"
              size="mini"
              plain
              icon="el-icon-view"
              >隐藏</el-button
            >
            <el-button @click="handleHide(row, false)" type="primary" v-else size="mini" plain icon="el-icon-view"
              >显示</el-button
            >
            <delete-button @confirm="handleDel(row)" :title="row.name" />
          </template>
        </el-table-column>
      </basis-table>
    </el-card>
    <!-- 新增编辑 -->
    <el-dialog :visible.sync="isShowEdit" :title="isAdd ? '新建' : '编辑'" width="520px" @close="handleClose">
      <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="Number(key)" v-for="(item, key) in menuType" :key="key">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级" prop="parentId">
          <el-input v-model="form.parentId" />
        </el-form-item>
        <el-form-item :label="`${menuType[form.type]}名称`" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="form.permission" />
        </el-form-item>
        <template v-if="form.type === 0">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" readonly>
              <el-popover placement="right" :autoAdjustOverflow="false" title="选择图标" slot="append">
                <div class="menu-icon">
                  <icon-picker v-model="form.icon" />
                </div>
                <span slot="reference" class="cursor-p">
                  <i :class="form.icon" v-if="form.icon"></i>
                  <span v-else>选择</span>
                </span>
              </el-popover>
            </el-input>
          </el-form-item>
          <el-form-item label="序号" prop="priority">
            <el-input-number v-model="form.priority" />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStorage } from '@/utils/storage';
import { convertToTree } from '@/utils';
import { MENU_TYPE } from '@/config/dictionary';
import IconPicker from '@/components/IconPicker';
const initForm = {
  name: '',
  parentId: 0,
  permission: '',
  icon: '',
  type: 0,
  priority: 0
};
export default {
  data() {
    const menu = getStorage('menus');
    const menuTree = convertToTree({ data: menu, pid: 0 });
    return {
      tableData: menuTree,
      isShowEdit: false,
      isAdd: true,
      menuType: MENU_TYPE,
      form: {},
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        permission: [{ required: true, trigger: 'blur', message: '请输入权限标识' }]
      }
    };
  },
  components: {
    IconPicker
  },
  methods: {
    handleAdd() {
      this.isAdd = true;
      this.isShowEdit = true;
      this.form = { ...initForm };
    },
    handleAddChild(row) {
      this.isAdd = true;
      this.isShowEdit = true;
      this.form = { ...initForm, parentId: row.id };
    },
    handleHide(row, status) {
      console.log(row, status);
      row.hide = status;
      this.$message.success('操作成功');
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

<style scoped>
.icon {
  color: #555;
}
.menu-icon {
  width: 400px;
  height: 400px;
  overflow-y: auto;
}
</style>
