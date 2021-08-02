<template>
  <el-dialog :visible="show" title="授权" width="520px" @close="handleCancel">
    <div class="auth-menu-wrap">
      <div style="padding-bottom: 10px">
        <el-checkbox @change="handleCheckAll" v-model="checkAll">全选</el-checkbox>
      </div>
      <el-tree
        :default-checked-keys="value"
        ref="menuTree"
        check-strictly
        show-checkbox
        :data="menus"
        node-key="id"
        :props="{ children: 'children', label: 'name', key: 'id' }"
        @check-change="handleMenuCheckChange"
        @check="handleMenuChange"
      />
    </div>
    <span slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getStorage } from '@/utils/storage';
import { convertToTree } from '@/utils';
const menu = getStorage('menus');
const menuTree = convertToTree({ data: menu, pid: 0 });
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      menus: menuTree,
      checkAll: false
    };
  },
  mounted(){
    // this.$refs.menuTree.setCheckedNodes(this.value);
  },
  methods: {
    handleCancel() {
      this.$emit('update:show', false);
      this.$emit('cancel');
    },
    handleOk() {
      let checkedNodes = this.$refs.menuTree.getCheckedKeys(false, true);
      this.$emit('input', checkedNodes);
      this.$emit('update:show', false);
      this.$emit('confirm', checkedNodes);
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId;
        this.$refs.menuTree.setChecked(parentId, true, false);
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach((element) => {
            this.$refs.menuTree.setChecked(element.id, false, false);
          });
        }
      }
    },
    handleMenuChange(data, check) {
      if (data.children?.length && check.checkedKeys.includes(data.id)) {
        this.setCheckedOfDeep(this.$refs.menuTree, data, 'id', true);
      }
    },
    // 递归选中子节点
    setCheckedOfDeep(treeRef, data, nodeKey = 'id', val = true) {
      treeRef.setChecked(data[nodeKey], val, true);
      return data.children?.length && data.children.map((item) => this.setCheckedOfDeep(treeRef, item, nodeKey, val));
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      this.$refs.menuTree.setCheckedNodes(this.value);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menus, allMenus);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach((menu) => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-menu-wrap {
  max-height: 500px;
  overflow-y: auto;
}
</style>