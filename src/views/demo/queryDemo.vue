<template>
  <div class="query-data">
    <t-query-condition :opts="opts" :add="true"  @submit="conditionEnter" />
  </div>
</template>
<script>
const ADDRESS_TYPES = [
  {
    label: '前纺一车间',
    key: 'W1'
  },
  {
    label: '前纺二车间',
    key: 'W2'
  },
  {
    label: '前纺三车间',
    key: 'W3'
  }
];
export default {
  name: 'queryData',
  data () {
    return {
      queryData: {
        likeCargoNo: '',
        likeBookNo: '',
        likeTransportNo: '',
        likeCargoName: '',
        workshopNum: '',
        workshopNum1: '',
        date1: '',
        date2: '',
        date: ''
      },
      opts:{
          likeCargoNo: {
          label: '货源编号',
          comp: 'el-input',
          bind: {
          }
        },
        likeBookNo: {
          label: '订单编号',
          comp: 'el-input',
          bind: {
          }
        },
        likeTransportNo: {
          label: '运单编号',
          comp: 'el-input',
          bind: {
          }
        },
        likeCargoName: {
          label: '货品名称',
          comp: 'el-input',
          bind: {
          }
        },
        workshopNum1: {
          label: '车间2',
          comp: 'el-select',
          changeEvent: 'change',
          // defaultVal: 'W1',
          bind: {
          },
          child: ADDRESS_TYPES.reduce((acc, cur) => {
            acc.push({
              comp: 'el-option',
              value: cur.key,
              bind: {
                label: cur.label,
                key: cur.key
              }
            });
            return acc;
          }, [])
        },
        workshopNum: {
          label: '车间',
          comp: 'el-select',
          changeEvent: 'change',
          // defaultVal: 'W1',
          bind: {
          },
          child: [
            {
              comp: 'el-option',
              value: 'W1',
              bind: {
                label: '前纺一车间',
                key: 'W1'
              }
            },
            {
              comp: 'el-option',
              value: 'W2',
              bind: {
                label: '前纺二车间',
                key: 'W2'
              }
            },
            {
              comp: 'el-option',
              value: 'W3',
              bind: {
                label: '前纺三车间',
                key: 'W3'
              }
            }
          ]
        },
        date1: {
          label: '日期',
          comp: 'el-date-picker',
          bind: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        date: {
          label: '日期范围',
          comp: 'el-date-picker',
          span: 2,
          bind: {
            type: 'daterange',
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      }
    };
  },
  // 方法
  methods: {
      // 查询条件所需参数
    getQueryData () {
      const { likeCargoNo, likeBookNo, likeTransportNo, likeCargoName, workshopNum, workshopNum1, date1, date } = this.queryData;
      return {
        likeCargoNo,
        likeBookNo,
        likeTransportNo,
        likeCargoName,
        workshopNum,
        workshopNum1,
        date1,
        beginDate: date[0] ? date[0] : null,
        endDate: date[1] ? date[1] : null
      };
    },
    // 点击查询按钮
    conditionEnter (data) {
      console.log('查询条件', data);
      this.queryData = data;
    }
  }
};
</script>