let findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type);
};

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};
// 输入框增加emoji
const emoji = {
  bind(el) {
    // 正则规则可根据需求自定义
    var regRule = /[^\u4E00-\u9FA5|\d|a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g;
    let $inp = findEle(el, 'input');
    el.$inp = $inp;
    $inp.handle = function () {
      let val = $inp.value;
      $inp.value = val.replace(regRule, '');

      trigger($inp, 'input');
    };
    $inp.addEventListener('keyup', $inp.handle);
  },
  unbind(el) {
    el.$inp.removeEventListener('keyup', el.$inp.handle);
  }
};

export default emoji;

/* <input type="text" v-model="note" v-emoji /> */
