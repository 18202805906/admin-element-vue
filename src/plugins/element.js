import {
  Button,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Radio,
  Row,
  Col,
  Loading,
  MessageBox,
  Message,
  Dialog,
  Notification,
  Card,
  Container,
  Aside,
  Header,
  Footer,
  Menu,
  MenuItem,
  Submenu,
  Main,
  Image,
  Timeline,
  TimelineItem,
  Tooltip,
  Badge,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Pagination,
  Select,
  Option,
  DatePicker,
  Tag,
  Switch,
  InputNumber,
  Popover,
  Cascader,
  Tree,
  Checkbox,
  Upload,
} from 'element-ui';

import '@/assets/styles/rewrite.scss';

export default (Vue) => {
  // 全局配置
  Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
  // import Fragment from 'vue-fragment';
  Vue.use(Button);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Dialog);
  Vue.use(Card);
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Header);
  Vue.use(Footer);
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Submenu);
  Vue.use(Main);
  Vue.use(Image);
  Vue.use(Timeline);
  Vue.use(TimelineItem);
  Vue.use(Tooltip);
  Vue.use(Badge);
  Vue.use(Dropdown);
  Vue.use(DropdownMenu);
  Vue.use(DropdownItem);
  Vue.use(Avatar);
  Vue.use(Breadcrumb);
  Vue.use(BreadcrumbItem);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Pagination);
  Vue.use(Select);
  Vue.use(Option);
  Vue.use(DatePicker);
  Vue.use(Tag);
  Vue.use(Switch);
  Vue.use(InputNumber);
  Vue.use(Popover);
  Vue.use(Cascader);
  Vue.use(Tree);
  Vue.use(Checkbox);
  Vue.use(Upload);

  Vue.use(Loading.directive);
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;
  // 解决elementui Menu组件中不能嵌套div的问题
  // Vue.use(Fragment.Plugin);
};