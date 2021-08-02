<template>
  <el-aside :width="collapse ? siderCloseWidth : siderOpenWidth">
    <div class="x-sider">
      <el-menu
        class="menu-box"
        unique-opened
        :collapse="collapse"
        :default-active="selectedKeys"
        :default-openeds="localOpeneds"
        :collapse-transition="false"
      >
        <template v-for="item in menus">
          <template v-if="!item.hide">
            <el-submenu :key="item.id" :index="item.url" v-if="item.children && item.children.length >= 1">
              <template slot="title">
                <i :class="item.icon" class="menu-ico" v-if="item.icon" />
                <span slot="title">{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <el-menu-item :key="subItem.id" :index="subItem.url" @click="changeUrl(subItem.url)" v-if="!subItem.hide">
                  <template slot="title">
                    <i :class="subItem.icon" class="menu-ico" v-if="subItem.icon" />
                    <span>{{ subItem.name }}</span>
                  </template>
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item :key="item.id" @click="changeUrl(item.url)" :index="item.url" v-else>
              <template slot="title">
                <i :class="item.icon" class="menu-ico" v-if="item.icon" />
                <span slot="title">{{ item.name }}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>
<script>
import config from '@/config';
export default {
  data() {
    return {
      localOpeneds: [],
      siderOpenWidth: config.siderOpenWidth,
      siderCloseWidth: config.siderCloseWidth
    };
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    selectedKeys: {
      type: String,
      default: () => ''
    },
    theme: {
      type: String,
      default: 'dark'
    }
  },
  created() {
    this.$watch(
      'openKeys',
      (newVal) => {
        this.localOpeneds = newVal;
      },
      {
        immediate: true
      }
    );
  },
  methods: {
    handleCollapse() {
      this.$emit('update:collapse', !this.collapse);
    },
    changeUrl(url){
      this.$router.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.x-sider {
  width: 100%;
  /* height: 100vh; */
  overflow: hidden;
}

.menu-box {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 60px);
  width: calc(100% + 17px);
  // transition: width 0.5s ease;
}
.menu-ico {
  margin-right: 6px;
  font-size: 16px;
}
</style>
