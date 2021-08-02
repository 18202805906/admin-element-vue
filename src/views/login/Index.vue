<template>
  <div class="login-page">
    <ul class="background">
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
</ul>
    <el-card class="login-form">
      <p>{{title}}</p>
      <el-form :model="loginInfo" :rules="rules" @keydown.enter.native="login('loginForm')" class="demo-editForm login-container" label-position="left" label-width="0px" ref="loginForm">
        <el-form-item prop="username">
          <el-input autocomplete="off" placeholder="账号" type="text" v-model="loginInfo.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input autocomplete="off" placeholder="密码" type="password" v-model="loginInfo.password"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" @click.native.prevent="login('loginForm')" style="width:100%;" type="primary">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { set, remove } from 'js-cookie';
import { setStorage } from '@/utils/storage';
import config from '@/config';
import { cryptoPassword } from '@/utils';
import AuthApi from '@/api/auth';
export default {
  data() {
    return {
      loading: false,
      title: config.appTitle,
      loginInfo: {
        username: 'admin',
        password: 'admin',
        role: 'super'
      },
      rules: {
        username: [
          {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '请输入用户名'
          }
        ],
        password: [
          {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          }
        ]
      }
    };
  },
  computed: {
    redirect() {
      let noRedirect = ['/err', '/login'];
      let redirectUrl = this.$route.query.redirect || '/';
      return noRedirect.includes(redirectUrl) ? '/' : redirectUrl;
    }
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$router.replace('/home');
          this.loading = true;
          const password = cryptoPassword(
            this.loginInfo.password,
            config.cryptoKey
          );
          AuthApi
            .login({
              ...this.loginInfo,
              password
            })
            .then(res => {
              this.$message.success('登录成功！');
              set(config.tokenKey, res.token);
              set(config.refreshTokenKey, res.refresh_token);
              set(config.tokenExpiresKey, Date.now() + res.expires_in * 1000 - config.refreshAheadTime);
              setStorage('userinfo', res);
              this.getMenuList();
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          this.$message.error('用户名或密码输入不正确！');
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        return cur !== 'redirect' ? (acc[cur] = query[cur]) : acc;
      }, {});
    },
    // 储存菜单及用户信息
    getMenuList() {
      AuthApi.getMenus({}).then((res) => {
        // 存储用户信息
        setStorage('userinfo', res.detail);
        setStorage('permissions', res.btnPermissions);
        // 存储返回的菜单
        setStorage('rawMenu', res.menus);
        this.$router.replace({
          path: this.redirect,
          query: this.getOtherQuery(this.$route.query)
        });
      });
    }
  }
};
</script>
<style lang="scss">
.login-page {
  position: relative;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding-top: 200px;
  overflow: hidden;
}
.login-form {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 999;
  background: #fff;
}
@keyframes animate {
    0%{
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }
    100%{
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }
}

.background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    // background: lighten($color: $primary-color, $amount: 100);
    background: #eee;
    overflow: hidden;
}
.background li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(0,0,0, 0.04);
    animation: animate 19s linear infinite;
}

.background li:nth-child(0) {
    left: 70%;
    width: 122px;
    height: 122px;
    bottom: -122px;
    animation-delay: 1s;
}
.background li:nth-child(1) {
    left: 26%;
    width: 172px;
    height: 172px;
    bottom: -172px;
    animation-delay: 3s;
}
.background li:nth-child(2) {
    left: 17%;
    width: 112px;
    height: 112px;
    bottom: -112px;
    animation-delay: 10s;
}
.background li:nth-child(3) {
    left: 42%;
    width: 114px;
    height: 114px;
    bottom: -114px;
    animation-delay: 10s;
}
.background li:nth-child(4) {
    left: 42%;
    width: 163px;
    height: 163px;
    bottom: -163px;
    animation-delay: 4s;
}
.background li:nth-child(5) {
    left: 0%;
    width: 176px;
    height: 176px;
    bottom: -176px;
    animation-delay: 20s;
}
.background li:nth-child(6) {
    left: 18%;
    width: 145px;
    height: 145px;
    bottom: -145px;
    animation-delay: 19s;
}
.background li:nth-child(7) {
    left: 32%;
    width: 195px;
    height: 195px;
    bottom: -195px;
    animation-delay: 19s;
}
.background li:nth-child(8) {
    left: 27%;
    width: 118px;
    height: 118px;
    bottom: -118px;
    animation-delay: 31s;
}
.background li:nth-child(9) {
    left: 66%;
    width: 114px;
    height: 114px;
    bottom: -114px;
    animation-delay: 6s;
}
</style>
