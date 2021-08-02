# 基础表格
## 使用方法
```js
// 引入组件
import BasisTable from '@/components/BasisTable';
```
```js
// 注册组件
component: {
    BasisTable
}
```
```html
// 使用组件
<basis-table :data="data" :pagination="pagination"></basis-table>
```

## API
### Props

属性|必须|说明|类型|默认值
:---:|:---:|:---:|:---:|:---:
rowKey|false|唯一标识|String|id
showIndex|false|是否显示序号列|Boolean|false
selection|false|是否显示选择框列|Boolean|false
pagination.sync|false|分页设置,支持sync修饰符|Object|null

### Events
对应`Pagination`组件的`Events`。

事件名称|说明|回调参数
:---:|:---:|:---:
page-size-change|pageSize 改变时会触发|每页条数
page-change|currentPage 改变时会触发|当前页
page-prev-click|用户点击上一页按钮改变当前页后触发|当前页
page-next-click|用户点击下一页按钮改变当前页后触发|当前页

**注意：**
    1. `ElementUI`的[`Table`](https://element.eleme.cn/#/zh-CN/component/table)组件相关`Attributes`和`Events`同样适用该组件，如果需要使用Table的Methods,可通过ref获取到该组件引用然后调用`getTable`拿到`ElmentUI`的`Table`，然后使用其Methods。
    2. `pagination`接受[`Pagination`](https://element.eleme.cn/#/zh-CN/component/pagination)的所有`Attributes`。

<br/>
