<template>
  <el-header class="layout-header" :style="{ background: themeColor }">
    <div class="header-left">
      <slot name="logo"></slot>
      <!-- <i class="trigger" :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="handleCollapse" /> -->
      <slot name="breadCrumb"></slot>
    </div>
    <div class="header-right r-nw-fe-c">
      <el-tooltip content="首页">
        <i class="el-icon-house quick"  @click="$router.push('/home')"/>
      </el-tooltip>
      <el-tooltip :content="`有${count}未读消息`">
        <el-badge :value="Number(count)" :max="99" class="quick">
          <i style="font-size: 22px" class="el-icon-message" />
        </el-badge>
      </el-tooltip>
      <el-tooltip content="API文档">
        <i class="el-icon-document quick"  @click="goToApi"/>
      </el-tooltip>
      <el-tooltip content="切换主题">
        <l-theme-picker class="quick" ref="theme" @themeChange="(val)=>{themeColor = val}"></l-theme-picker>
      </el-tooltip>
      <el-dropdown  @command="handleClick">
        <div class="user">
          <el-avatar size="medium" icon="el-icon-user-solid" />
          <span style="margin-left: 10px; vertical-align: middle; color: #fff">
            {{ userInfo.username }}
            <i class="el-icon-caret-bottom" style="margin-left: 5px; font-size: 10px" />
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="person"> <i class="el-icon-edit-outline" />修改密码 </el-dropdown-item>
          <el-dropdown-item command="logout"> <i class="el-icon-switch-button" />退出登录 </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      
    </div>
    <l-personal-edit v-model="visiblePsd"></l-personal-edit>
  </el-header>
</template>

<script>
import { mapState } from 'vuex';
import { logout } from '@/router';
import { getStorage } from '@/utils/storage';
import LPersonalEdit from './module/LPersonalEdit';
import LThemePicker from './module/LThemePicker';
import config from '@/config';
export default {
  components: {
    LPersonalEdit,
    LThemePicker
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    breadCrumb: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      count: getStorage('count') || 0,
      visiblePsd: false,
      themeColor: getStorage('el:themeColor') || config.themeColor
    };
  },
  computed: mapState({
    userInfo: (state) => state.user.userinfo
  }),
  methods: {
    handleCollapse() {
      this.$emit('update:collapse', !this.collapse);
    },
    handleClick(key) {
      switch (key) {
        case 'person':
          this.visiblePsd = true;
          break;
        case 'logout':
          this.$confirm('您确定要退出吗？','提示',{type: 'warning'}).then(logout);
          break;
      }
    },
    goToApi() {
      alert('开发中!');
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-header {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: linear-gradient(to right,$primary-color, lighten($primary-color, 10));
  z-index: 11;
}
.header-left {
  display: flex;
  align-items: center;
}
.trigger {
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: #eee;
  &:hover {
    color: #fff;
  }
}
.header-right {
  .quick {
    margin-right: 20px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
  .user{
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
.nav-menu {
  position: relative;
  margin-right: 30px;
  cursor: pointer;
  width: 100px;
  height: 100%;
  font-size: 14px;
  letter-spacing: 1px;
  text-align: center;
  color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.2);
  .arrow {
    transition: all 0.8s ease 0s;
  }
  .rotate {
    transform: rotate(180deg);
  }
}

</style>