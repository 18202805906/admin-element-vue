<template>
  <div>
    <h5>table单个单元格编辑操作</h5>
    <t-table
      :isShowTips="false"
      :table="singleEditConfig.table"
      :columns="singleEditConfig.table.columns"
      :listTypeInfo="singleEditConfig.listTypeInfo"
      @handleEvent="handleEvent"
      @save="singleSave"
    />
    <h5>简单操作</h5>
    <t-table title="常规表格" :table="baseData.table" :columns="baseData.columns" @radioChange="radioChange" />
    <t-table title="双击单元格复制" :table="baseData.table" :columns="baseData.columns" isCopy />
    <t-table title="文字变色" :table="changeColor.table" :columns="changeColor.columns" />
    <t-table title="显示分页器" :table="baseData.table" :columns="baseData.columns" isShowPagination />
    <t-table title="显示复选框" :table="baseData.table2" @selection-change="selectionChange" :columns="baseData.columns" isShowPagination />
    <t-table title="显示序列" :table="baseData.table1" :columns="baseData.columns" isShowPagination />
    <t-table title="动态显示隐藏列" columnSetting name="TtableColumnSet" :table="columnSetData.table" :columns="columnSetData.columns" />
    <h5>按钮操作</h5>
    <t-table title="表格内操作" :table="operatorData.table" :columns="operatorData.columns" />
    <t-table title="表格外操作" highlightCurrentRow :table="operatorData.table1" :columns="operatorData.columns">
      <!-- 必须要有toolbar插槽 -->
      <template #toolbar></template>
    </t-table>
    <t-table title="自定义插槽使用" :table="filtersData.table" :columns="filtersData.columns">
      <!-- 自定义插槽 -->
      <template #amount="{ param }">${{ param.row.amount }}</template>
    </t-table>
  </div>
</template>

<script>
export default {
  name: 'TTableDemo',
  data() {
    return {
      // 编辑某个单元格
      singleEditConfig: {
        table: {
          border: true,
          firstColumn: { type: 'index', label: '序列' }, // 显示序列号
          data: [
            {
              name: '张三',
              hobby: '1',
              hobby1: ['1', '2'],
              date: '2022-01-18',
              year: '2022',
              time: '2022-01-18 16:58:58',
              remake: '备注张三',
              number: 12
            },
            {
              name: '李四',
              hobby: '2',
              hobby1: ['0', '2'],
              date: '2022-01-19',
              year: '2021',
              time: '2022-01-19 16:58:58',
              remake: '备注李四',
              number: 15
            }
          ],
          columns: [
            {
              prop: 'name',
              label: '姓名',
              minWidth: '100',
              canEdit: true,
              renderHeader: (h, { column }) => {
                const style = {
                  color: '#F56C6C',
                  fontSize: '16px',
                  marginRight: '3px'
                };
                return (
                  <div>
                    <span style={style}>*</span>
                    <span>{column.label}</span>
                  </div>
                );
              }
            },
            {
              prop: 'hobby',
              label: '爱好单选',
              minWidth: '180',
              headerRequired: true,
              canEdit: true,
              configEdit: {
                label: '爱好单选',
                type: 'select-arr',
                editComponent: 'el-select',
                list: 'hobbyList',
                event: 'hobbyList',
                arrLabel: 'label',
                arrKey: 'value'
              }
            },
            {
              prop: 'hobby1',
              label: '爱好多选',
              minWidth: '180',
              renderHeader: (h, { column }) => {
                return (
                  <div>
                    <span>{column.label}</span>
                    <i class="el-icon-question" style="color:#409eff;margin-left:5px;font-size:15px;"></i>
                  </div>
                );
              },
              canEdit: true,
              configEdit: {
                label: '爱好多选',
                type: 'el-select-multiple',
                editComponent: 'el-select',
                list: 'hobbyList',
                event: 'hobbyList1',
                bind: { multiple: true },
                arrLabel: 'label',
                arrKey: 'value'
              }
            },
            {
              prop: 'date',
              label: '日期',
              minWidth: '180'
            },
            {
              prop: 'year',
              label: '日期年',
              minWidth: '180',
              canEdit: true,
              configEdit: {
                label: '日期年',
                type: 'year',
                editComponent: 'el-date-picker',
                bind: { valueFormat: 'yyyy' }
              }
            },
            {
              prop: 'time',
              label: '日期时间',
              minWidth: '180',
              canEdit: true,
              configEdit: {
                label: '日期时间',
                type: 'datetime',
                editComponent: 'el-date-picker',
                bind: {
                  valueFormat: 'yyyy-MM-dd hh:mm:ss'
                }
              }
            },
            {
              prop: 'number',
              label: '计数器',
              minWidth: '220',
              canEdit: true,
              configEdit: {
                label: '计数器',
                type: 'inputNumber',
                bind: { min: 0, max: 99 },
                editComponent: 'el-input-number'
              }
            },
            {
              prop: 'remake',
              label: '备注',
              minWidth: '220',
              canEdit: true,
              configEdit: {
                label: '备注',
                type: 'textarea',
                bind: { type: 'textarea' },
                editComponent: 'el-input'
              }
            }
          ],
          // 表格内操作列
          operator: [
            {
              type: 'text',
              text: '删除',
              fun: this.editDel
            }
          ]
        },
        // 下拉选择项
        listTypeInfo: {
          hobbyList: [
            { label: '吉他', value: '0' },
            { label: '看书', value: '1' },
            { label: '美剧', value: '2' },
            { label: '旅游', value: '3' },
            { label: '音乐', value: '4' }
          ]
        }
      },
      baseData: {
        table: {
          border: true, // 可自动调整列宽
          firstColumn: { type: 'radio' }, // 显示单选框
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '1',
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              address: '广东省广州市天河区3'
            }
          ]
        },
        table2: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          firstColumn: { type: 'selection' }, // 显示复选框
          border: true, // 可自动调整列宽
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '1',
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              address: '广东省广州市天河区3'
            }
          ]
        },
        table1: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          firstColumn: { type: 'index', label: '序列' }, // 显示序列号
          border: true, // 可自动调整列宽
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '1',
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              address: '广东省广州市天河区3'
            }
          ]
        },
        columns: [
          { prop: 'name', label: '姓名', minWidth: '100', sort: true },
          { prop: 'date', label: '日期', minWidth: '180', sort: true },
          { prop: 'date', label: '日期', minWidth: '180', sort: true },
          { prop: 'date', label: '日期', minWidth: '180', sort: true },
          { prop: 'address', label: '地址', minWidth: '220', sort: true }
        ]
      },
      // 文字变色
      changeColor: {
        table: {
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '1',
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              address: '广东省广州市天河区3'
            }
          ],
          // 状态值为3时，文字变色
          changeColor: { key: 'status', val: '3', txtStyle: '#ef473a' }
        },
        columns: [
          { prop: 'name', label: '姓名', minWidth: '100', sort: true },
          { prop: 'date', label: '日期', minWidth: '180', sort: true },
          { prop: 'date', label: '日期', minWidth: '180', sort: true },
          { prop: 'date', label: '日期', minWidth: '180', sort: true },
          { prop: 'address', label: '地址', minWidth: '220', sort: true }
        ]
      },
      // 动态显示隐藏列
      columnSetData: {
        table: {
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              amount: 3000,
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '2',
              amount: 2000,
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              amount: 4000,
              address: '广东省广州市天河区3'
            }
          ]
        },
        columns: [
          { prop: 'name', label: '姓名', minWidth: '100' },
          { prop: 'date', label: '日期', minWidth: '160' },
          { prop: 'address', label: '地址', minWidth: '220' },
          { prop: 'status', label: '状态', minWidth: '100', filters: { param: 'PROTOCOL_BUSS_TYPE' } },
          { prop: 'amount', label: '金额', minWidth: '160', filters: { method: '￥' } },
          { prop: 'address77', label: '地址77', minWidth: '220' },
          { prop: 'name1', label: '姓名1', minWidth: '100' },
          { prop: 'date22', label: '日期22', minWidth: '180' },
          { prop: 'address33', label: '地址33', minWidth: '220' },
          { prop: 'name44', label: '姓名44', minWidth: '100' },
          { prop: 'date55', label: '日期55', minWidth: '180' },
          { prop: 'address66', label: '地址66', minWidth: '220' }
        ]
      },
      // 自定义插槽
      filtersData: {
        table: {
          // 数据
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              amount: 3000,
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '2',
              amount: 2000,
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              amount: 4000,
              address: '广东省广州市天河区3'
            }
          ]
        },
        columns: [
          { prop: 'name', label: '姓名', minWidth: '100' },
          { prop: 'date', label: '日期', minWidth: '160' },
          { prop: 'address', label: '地址', minWidth: '220' },
          { prop: 'status', label: '状态', minWidth: '100'},
          { prop: 'amount', label: '金额', minWidth: '160', slotName: 'amount' },
          { prop: 'address', label: '地址', minWidth: '220' },
          { prop: 'name', label: '姓名', minWidth: '100' },
          { prop: 'date', label: '日期', minWidth: '180' },
          { prop: 'address', label: '地址', minWidth: '220' },
          { prop: 'name', label: '姓名', minWidth: '100' },
          { prop: 'date', label: '日期', minWidth: '180' },
          { prop: 'address', label: '地址', minWidth: '220' }
        ]
      },
      // 表格内操作
      operatorData: {
        table: {
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '1',
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              address: '广东省广州市天河区3'
            }
          ],
          // 表格内操作列
          operator: [
            {
              text: '新增',
              type: 'text',
              fun: this.add,
              // status为1时，不显示此按钮
              noShow: [{ key: 'status', val: ['1'] }]
            },
            {
              text: '编辑',
              type: 'text',
              // status值为2时，展示此按钮
              show: { key: 'status', val: ['2'] },
              fun: this.edit
            },
            {
              text: '删除',
              type: 'text',
              fun: this.del
            }
          ],
          // 操作列样式
          operatorConfig: {
            fixed: 'right', // 固定列表右边（left则固定在左边）
            width: 280,
            label: '操作'
          }
        },
        columns: [
          { prop: 'name', label: '姓名', minWidth: '100', noShowColumn: true },
          { prop: 'date', label: '日期', minWidth: '180', noShowColumn: true },
          { prop: 'address', label: '地址', minWidth: '220', noShowColumn: true },
          { prop: 'date', label: '日期', minWidth: '180', noShowColumn: true },
          { prop: 'address', label: '地址', minWidth: '220', noShowColumn: true }
        ],
        table1: {
          data: [
            {
              id: '1',
              date: '2019-09-25',
              name: '张三',
              status: '2',
              address: '广东省广州市天河区'
            },
            {
              id: '2',
              date: '2019-09-26',
              name: '张三1',
              status: '1',
              address: '广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2'
            },
            {
              id: '3',
              date: '2019-09-27',
              name: '张三2',
              status: '3',
              address: '广东省广州市天河区3'
            }
          ],
          // 表格外操作，选中表格某行，可以将其数据传出
          toolbar: [
            {
              text: '返回上一个页面1',
              icon: 'el-icon-circle-plus-outline',
              type: 'danger',
              fun: this.getBack
            },
            {
              text: '返回上一个页面2',
              icon: 'el-icon-circle-plus-outline',
              type: 'danger',
              fun: this.getBack
            },
            {
              text: '返回上一个页面3',
              icon: 'el-icon-circle-plus-outline',
              type: 'danger',
              fun: this.getBack
            },
            {
              text: '返回上一个页面4',
              icon: 'el-icon-circle-plus-outline',
              type: 'danger',
              fun: this.getBack
            }
          ]
        }
      },
      // 编辑表格
      editConfig: {
        table: {
          border: true,
          firstColumn: { type: 'index', label: '序列' }, // 显示序列号
          data: [],
          columns: [
            { prop: 'name', label: '姓名', minWidth: '100', configEdit: { label: '姓名', type: 'input', editComponent: 'el-input' } },
            {
              prop: 'hobby',
              label: '爱好',
              minWidth: '180',
              configEdit: {
                label: '爱好',
                type: 'select-arr',
                editComponent: 'el-select',
                list: 'hobbyList',
                event: 'hobbyList',
                arrLabel: 'label',
                arrKey: 'value'
              }
            },
            {
              prop: 'number',
              label: '计数器',
              minWidth: '220',
              configEdit: {
                label: '计数器',
                type: 'inputNumber',
                bind: { controls: true, min: 0, max: 99 },
                editComponent: 'el-input-number'
              }
            },
            {
              prop: 'checkbox',
              label: '复选框',
              minWidth: '220',
              configEdit: {
                label: '复选框',
                type: 'checkbox',
                list: 'hobbyList',
                editComponent: 'el-checkbox-group'
              }
            }
          ],
          // 表格内操作列
          operator: [
            {
              type: 'text',
              text: '删除',
              fun: this.editDel
            }
          ]
        },
        // 下拉选择项
        listTypeInfo: {
          hobbyList: [
            { label: '吉他', value: '0' },
            { label: '看书', value: '1' },
            { label: '美剧', value: '2' },
            { label: '旅游', value: '3' },
            { label: '音乐', value: '4' }
          ]
        }
      }
    };
  },
  methods: {
    singleSave(data) {
      console.log('单个单元格编辑保存', data);
    },
    radioChange(row) {
      console.log('单选传出数据', row);
    },
    /****
     * 编辑表格
     */
    editAdd() {
      console.log('新增');
      const objAdd = {
        name: '',
        hobby: '',
        checkbox: [],
        number: 0
      };
      this.editConfig.table.data.push(objAdd);
    },
    editDel(item, index, row) {
      row.splice(index, 1);
      console.log('删除', item, row, index);
    },
    // 编辑每一项的change事件
    handleEvent(type, val) {
      console.log('handleEvent', type, val);
      switch (type) {
        case 'hobbyList':
          console.log('hobbyList', val);
          break;
      }
    },
    save(data) {
      const flag = data.some((item) => item.hobby === '');
      if (flag) {
        this.$message.error('爱好不能为空');
        return;
      }
      console.log('保存', data);
    },
    // 复选框选中
    selectionChange(val) {
      console.log('复选框选中值', val);
    },
    // 操作外按钮
    getBack(row) {
      console.log('选中行返回的数据', row);
    },
    // 新增
    add(val) {
      console.log('新增', val);
    },
    // 编辑
    edit(val) {
      console.log('编辑', val);
    },
    // 删除
    del(val) {
      this.$confirm('是否永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('删除', val);
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    }
  }
};
</script>
<style lang="scss">
</style>
