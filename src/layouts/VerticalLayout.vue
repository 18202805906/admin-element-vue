<template>
  <el-container class="layout">
    <l-header :collapse.sync="collapse" :bread-crumb="parentMenus" class="layout-header__fixed">
      <l-logo slot="logo" style="margin: 0 20px 0 0"></l-logo>
    </l-header>
    <el-container class="layout-main" style="padding-top: 60px">
      <l-sider :menus="menus" :theme="theme" :collapse.sync="collapse" :open-keys="openeds" :selected-keys="curtMenuKey"></l-sider>
      <div class="app-scroll-wrap">
        <l-bread-crumb :data="parentMenus" :collapse.sync="collapse" />
        <el-main class="app-main">
          <transition mode="out-in" name="fade-transform">
            <router-view></router-view>
          </transition>
        </el-main>
        <l-footer></l-footer>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import LayoutMinxin from '@/mixins/layout.mixin';
export default {
  name: 'vertical-layout',
  mixins: [LayoutMinxin()]
};
</script>
<style lang="scss" scoped>
@import url('../assets/styles/layout.scss');
</style>
