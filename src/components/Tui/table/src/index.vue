<template>
  <div class="t-table">
    <div class="header_wrap" v-if="title">
      <div class="header_title" >
        {{title}}
        <slot name="title" />
      </div>
      <div class="toolbar_top">
        <div v-if="isShow('toolbar')">
          <slot name="toolbar"></slot>
          <div class="toolbar">
            <el-button
              v-for="(item, index) in getToolbarBtn"
              :key="index"
              @click="toolbarFun(item)"
              :icon="item.icon?item.icon:'el-icon-search'"
              :type="item.type||'primary'"
              size="small"
            >{{item.text}}</el-button>
            <el-popover
              ref="popoverClose"
              popper-class="operator_popover operator_pop"
              class="operator_popover operator_pop"
              placement="bottom-start"
              trigger="hover"
              v-if="getToolbarDown.length"
            >
              <ul class="ulClose">
                <li
                  v-for="(item, index) in getToolbarDown"
                  :key="index"
                  @click="toolbarFun(item)"
                >{{item.text}}</li>
              </ul>
              <el-button size="small" type="primary" icon="el-icon-setting" slot="reference">
                操作
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-popover>
          </div>
        </div>
        <div class="header_right_wrap">
          <slot name="btn" />
          <!--列设置按钮-->
          <set-column
            v-if="columnSetting"
            v-bind="$attrs"
            :columns="columns"
            @columnSetting="v => columnSet = v"
          />
        </div>
      </div>
    </div>
    <el-table
      ref="el-table"
      :data="tableData"
      :class="{'cursor':isCopy,'highlightCurrentRow':highlightCurrentRow,'radioStyle':(table.firstColumn&&table.firstColumn.type==='radio')}"
      v-bind="$attrs"
      v-on="$listeners"
      :highlight-current-row="highlightCurrentRow"
      @row-click="rowClick"
      @cell-dblclick="cellDblclick"
    >
      <!-- 序列号/单选框/复选框 -->
      <div v-if="table.firstColumn">
        <!-- 复选框 -->
        <el-table-column
          :type="table.firstColumn.type"
          :width="table.firstColumn.width||50"
          :label="table.firstColumn.label"
          :align="table.firstColumn.align||'center'"
          v-if="table.firstColumn.type==='selection'"
        ></el-table-column>
        <!-- 单选框 -->
        <el-table-column
          :type="table.firstColumn.type"
          :width="table.firstColumn.width||50"
          :label="table.firstColumn.label"
          :align="table.firstColumn.align||'center'"
          v-if="table.firstColumn.type==='radio'"
        >
          <template slot-scope="scope">
            <el-radio v-model="radioVal" :label="scope.$index" @click.native.prevent="()=>{}"></el-radio>
          </template>
        </el-table-column>
        <!-- 序列号 -->
        <el-table-column
          :type="table.firstColumn.type"
          :width="table.firstColumn.width||50"
          :reserve-selection="table.firstColumn.isPaging||false"
          :label="table.firstColumn.label"
          :align="table.firstColumn.align||'center'"
          v-if="table.firstColumn.type==='index'"
        >
          <template slot-scope="scope">
            <span>{{isShowPagination?((table.currentPage - 1) * table.pageSize + scope.$index + 1):scope.$index + 1}}</span>
          </template>
        </el-table-column>
      </div>
      <slot name="begin"></slot>
      <template v-for="(item,index) in renderColumns">
        <el-table-column
          :key="index+'i'"
          :type="item.type"
          :label="item.label"
          :prop="item.prop"
          :min-width="item['min-width'] || item.minWidth || item.width"
          :sortable="item.sort"
          :render-header="item.renderHeader||(item.headerRequired&&renderHeader)"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.noShowTip"
          v-bind="{...item.bind,...$attrs}"
          v-on="$listeners"
        >
          <template slot-scope="scope">
              <!-- render渲染 -->
              <template v-if="item.customRender">
                <opt-comp
                  v-for="(comp, i) in item.customRender.comps"
                  :key="scope.$index + i.toString()"
                  v-bind="comp"
                  :scope="scope"
                />
              </template>
              <!-- 自定义插槽 -->
              <template v-if="item.slotName">
                <slot :name="item.slotName" :param="scope"></slot>
              </template>
              <!-- 单个单元格编辑 -->
              <template v-if="item.canEdit">
                <single-edit-cell
                  :canEdit="item.canEdit"
                  :configEdit="item.configEdit"
                  v-model="scope.row[scope.column.property]"
                  v-on="$listeners"
                  v-bind="$attrs"
                  ref="editCell"
                >
                  <template v-for="(index, name) in $slots" :slot="name">
                    <slot :name="name" />
                  </template>
                </single-edit-cell>
              </template>
              <div
                v-if="!item.slotName&&!item.customRender&&!item.canEdit"
                :style="{color:txtChangeColor(scope)}"
              >{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </template>
      <slot></slot>

      <el-table-column
        v-if="table.operator"
        :fixed="table.operatorConfig && table.operatorConfig.fixed"
        :label="(table.operatorConfig && table.operatorConfig.label) || '操作'"
        :min-width="(table.operatorConfig && (table.operatorConfig.width || table.operatorConfig.minWidth)) || 100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in table.operator"
            :key="index"
            @click="item.fun(scope.row,scope.$index,tableData)"
            :type="item.type"
            size="small"
            v-show="checkIsShow(scope,item)"
          >{{item.text}}</el-button>
        </template>
      </el-table-column>
      <slot name="end"></slot>
    </el-table>
    <el-pagination
      v-show="(tableData && tableData.length) && isShowPagination"
      :current-page="table.currentPage"
      @size-change="handleSizeChange"
      @current-change="handlesCurrentChange"
      :page-sizes="table.pageSizes || [10, 20, 50, 100]"
      :page-size="table.pageSize"
      :layout="sizeSelect?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
      :total="table.total"
      v-bind="$attrs"
      v-on="$listeners"
      background
    ></el-pagination>
    <!-- 按钮 -->
    <footer class="handle_wrap" v-if="isShowFooterBtn&&(tableData&&tableData.length>0)">
      <slot name="footer" />
      <div v-if="!$slots.footer">
        <el-button type="primary" @click="()=>$emit('save',tableData)">保存</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import SingleEditCell from './singleEditCell.vue';
import SetColumn from './setColumn.vue';
import OptComp from './optComp.vue';
export default {
  name: 'TTable',
  components: {
    SingleEditCell,
    SetColumn,
    OptComp
  },
  props: {
    // table所需数据
    table: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    // 表头数据
    columns: {
      type: Array,
      default: () => {
        return [];
      }
      // required: true
    },
    // 表格标题
    title: {
      type: String,
      default: ''
    },
    // 是否开启编辑模式(整行编辑模式)
    isEditCell: {
      type: Boolean,
      default: false
    },
    // 是否开启编辑保存按钮
    isShowFooterBtn: {
      type: Boolean,
      default: false
    },
    // 是否显示设置（隐藏/显示列）
    columnSetting: {
      type: Boolean,
      default: false
    },
    // 是否复制单元格
    isCopy: {
      type: Boolean,
      default: false
    },
    // 是否高亮选中行
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    // 是否需要显示切换页条数
    sizeSelect: {
      type: Boolean,
      default: false
    },
    // 是否显示分页
    isShowPagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      radioVal: '',
      // tableData: this.table.data,
      rowData: '',
      columnSet: []
    };
  },
  computed: {
    tableData(){
      return this.table.data;
    },
    columnByProp () {
      return this.columns.reduce((acc, cur) => {
        acc[cur.prop] = cur;
        return acc;
      }, {});
    },
    renderColumns () {
      return this.columnSet.length > 0 ? this.columnSet.reduce((acc, cur) => {
        if (!cur.hidden) {
          acc.push(this.columnByProp[cur.prop]);
        }
        return acc;
      }, []) : this.columns;
    },
    getToolbarBtn () {
      return this.table.toolbar ? this.table.toolbar.slice(0, 3) : [];
    },
    getToolbarDown () {
      return this.getToolbarBtn.length === 3 ? this.table.toolbar.slice(3, this.table.toolbar.length) : [];
    }
  },
  methods: {
    // 头部标题是否需要加头部必填*符号
    renderHeader (h, { column }) {
      const style = {
        color: '#F56C6C',
        fontSize: '16px',
        marginRight: '3px'
      };
      // 头部标题是否需要加头部必填*符号
      return (
        <div style="display: inline">
          <span style={style}>*</span>
          <span>{column.label}</span>
        </div>
      );
    },
    // 双击复制单元格内容
    cellDblclick (row, column) {
      if (!this.isCopy) {
        return false;
      }
      this.$copyText(row[column.property]).then(() => {
        this.$message.success('已复制');
      }, () => {
        this.$message.error('复制失败');
      });
    },
    // 是否显示表格操作按钮
    // TODO 需要在业务中根据需求更改
    checkIsShow (scope, item) {
      let isNoShow = false;
      if (item.noShow) {
        item.noShow.map(rs => {
          rs.isShow = typeof rs.val === 'string'
            ? (rs.val === 'isHadVal' ? (scope.row[rs.key] ? 'true' : 'false') : 'true')
            : (rs.val.includes(scope.row[rs.key]) ? 'false' : 'true');
        });
        isNoShow = item.noShow.every(key => {
          return key.isShow === 'true';
        });
      } else {
        isNoShow = true;
      }
      return (!item.show || item.show.val.includes(scope.row[item.show.key])) && isNoShow;
    },
    // 控制表格字体颜色
    txtChangeColor (scope) {
      if (this.table.changeColor && scope.row[this.table.changeColor.key] === this.table.changeColor.val) {
        return this.table.changeColor.txtStyle;
      } else {
        return '';
      }
    },
    // 当前页码
    handlesCurrentChange (val) {
      this.$emit('page-change', val);
    },
    // 每页数量
    handleSizeChange(val){
      this.$emit('size-change', val);
    },
    rowClick (row) {
      this.radioVal = this.table.data.indexOf(row);
      this.$emit('radioChange', row, this.radioVal);
      this.rowData = row;
      row.selectFlag = !row.selectFlag;
      if (row.selectFlag) {
        this.$refs['el-table'].setCurrentRow(row);
      } else {
        this.$refs['el-table'].setCurrentRow();
      }
    },
    // 表格头部按钮
    toolbarFun (item) {
      if (!this.rowData) {
        this.$message.warning('请选中行');
        return;
      }
      if (!this.rowData.selectFlag) {
        this.$message.warning('请选中行');
        return;
      }
      item.fun(this.rowData);
    },
    isShow (name) {
      return Object.keys(this.$slots).includes(name);
    }
  }
};
</script>
<style lang="scss" scoped>
.t-table {
  z-index: 0;
  background-color: #fff;
  padding: 10px;
  // border-radius: 4px;
  ::v-deep .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    // margin-right: 60px;
    margin-right: calc(2% - 20px);
    background-color: #fff;
  }
  // .el-table th,
  // .el-table td {
  //   padding: 8px 0;
  // }
  // .el-table--border th:first-child .cell,
  // .el-table--border td:first-child .cell {
  //   padding-left: 5px;
  // }
  // .el-table .cell {
  //   padding: 0 5px;
  // }
  // .el-table--scrollable-y .el-table__fixed-right {
  //   right: 8px !important;
  // }
  .header_wrap {
    display: flex;
    align-items: center;
    .toolbar_top {
      flex: 0 70%;
      display: flex;
      padding: 10px 0;
      align-items: center;
      justify-content: flex-end;
      .toolbar {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }
      .el-button--small {
        height: 32px;
      }
      .el-button--success {
        background-color: #53a8ff;
        border: 1px solid #53a8ff;
      }
    }
    .header_title {
      display: flex;
      align-items: center;
      flex: 0 30%;
      padding: 10px 0;
      font-size: 16px;
      font-weight: bold;
      line-height: 35px;
      margin-left: 10px;
    }
  }
  .marginBttom {
    margin-bottom: -8px;
  }
  // 复制功能样式
  .cursor {
    ::v-deep tbody {
      .el-table__row {
        cursor: pointer;
      }
    }
  }
  // 单选样式
  .radioStyle {
    ::v-deep .el-radio {
      .el-radio__label {
        display: none;
      }
      &:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
        box-shadow: none;
      }
    }
    ::v-deep tbody {
      .el-table__row {
        cursor: pointer;
      }
    }
  }
  // 选中行样式
  .highlightCurrentRow {
    ::v-deep tbody {
      .el-table__row {
        cursor: pointer;
      }
      .current-row td {
        cursor: pointer;
        color: #fff;
        background-color: #409eff !important;
      }
    }
  }
  .el-table--scrollable-y .el-table__body-wrapper {
    overflow-x: auto;
  }
  .handle_wrap {
    position: sticky;
    z-index: 10;
    right: 0;
    bottom: -8px;
    margin: 0 -8px -8px;
    padding: 12px 16px;
    background-color: #fff;
    border-top: 1px solid #ebeef5;
    text-align: right;
    .el-btn {
      margin-left: 8px;
    }
  }
}
// 表格外操作样式
.operator_pop {
  margin-left: 10px;
  min-width: 70px;
  padding: 0;
  .ulClose {
    font-size: 14px;
    padding: 0;
    margin: 5px 0;
    li {
      padding: 0 10px;
      text-align: center !important;
      font-size: 12px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 32px;
      cursor: pointer;
    }
    li:hover {
      color: #66b1ff;
      background: #ecf5ff;
    }
  }
  .el-popoverbtn {
    border: none;
    padding: 0 3px;
    padding-left: 6px;
  }
  .el-popoverbtn:hover {
    color: #66b1ff;
    background: #fff;
  }
}
.el-dropdown-menu {
  padding: 10px 20px 15px;
  font-size: 14px;
  .title {
    font-weight: bold;
  }
  ::v-deep .el-tree {
    .el-tree-node {
      .el-tree-node__content {
        .el-icon-caret-right {
          padding: 0 !important;
          &::before {
            content: '' !important;
          }
        }
      }
    }
  }
}
</style>
