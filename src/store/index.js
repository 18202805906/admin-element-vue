import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import config from '@/config';
Vue.use(Vuex);
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  devtools: process.env.NODE_ENV !== 'production',
  state: {
    theme: config.theme,
    themeColor: config.themeColor
  },
  mutations: {
    SET_THEMECOLOR: (state, themeColor) => {
      state.themeColor = themeColor;
    }
  },
  actions: {
    setThemeColor:({commit}, themeColor)=> {
      commit('SET_THEMECOLOR', themeColor);
  }
  },
  modules: {
    user
  }
});
