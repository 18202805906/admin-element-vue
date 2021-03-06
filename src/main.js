import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import 'normalize.css';
import '@/assets/styles/common.scss';
import App from './App.vue';
import components from '@/components';
import filters from '@/filters';
import directives from '@/directives';
import plugins from '@/plugins';
import config from '@/config';

Vue.config.productionTip = false;

Vue.use(components);
Vue.use(filters);
Vue.use(plugins);
Vue.use(directives);

new Vue({
  router,
  store,
  provide: {
    $pagination: config.pagination // 注入分页基础设置
  },
  render: (h) => h(App)
}).$mount('#app');
