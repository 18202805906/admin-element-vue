import element from './element';
import auth from './auth';
import './dayjs';
import VueClipboard from 'vue-clipboard2';

export default (Vue) => {
  Vue.use(element);
  Vue.use(auth);
  Vue.use(VueClipboard);
};