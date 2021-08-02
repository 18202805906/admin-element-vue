import element from './element';
import auth from './auth';
import './dayjs';

export default (Vue) => {
  Vue.use(element);
  Vue.use(auth);
};