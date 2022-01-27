import copy from './copy';
import longpress from './longpress';
import debounce from './debounce';
import bindEcharts from './bindEcharts';
const directives = {
  copy,
  longpress,
  debounce,
  bindEcharts
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  }
};
