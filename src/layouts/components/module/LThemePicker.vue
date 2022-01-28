
<template>
  <span>
    <el-color-picker
      v-model="themeColor"
      size="mini"
      :predefine="[
        '#409EFF',
        '#67C23A',
        '#E6A23C',
        '#f5222d',
        '#11a983',
        '#13c2c2',
        '#6959CD',
        '#434f5d',
      ]"
      class="theme-picker"
      popper-class="theme-picker-dropdown"
      title="换肤"
      @change="themeChange"
    />
  </span>
</template>
<script>
import config from '@/config';
import { setStorage, getStorage } from '@/utils/storage';
const version = require('element-ui/package.json').version; // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF'; // default color
export default {
  data() {
    return {
      chalk: '', 
      themeColor: config.themeColor,
    };
  },
  mounted() {
    this.themeColor=getStorage('el:themeColor') || config.themeColor;
    this.themeChange(this.themeColor);
  },
  methods: {
    async themeChange(val) {
      this.$emit('themeChange', val);
      setStorage('el:themeColor', val);
      this.$store.commit('SET_THEMECOLOR',val);
      const oldVal = this.chalk ? this.themeColor : ORIGINAL_THEME;
      console.log(oldVal, this.themeColor, val, this.chalk);
      if (typeof val !== 'string') return;
      const themeCluster = this.getThemeCluster(val.replace('#', ''));
      const originalCluster = this.getThemeCluster(oldVal.replace('#', ''));
      const $message = this.$message({
        message: '更换主题中...',
        customClass: 'theme-message',
        type: 'success',
        duration: 0,
        iconClass: 'el-icon-loading',
      });

      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(
            ORIGINAL_THEME.replace('#', '')
          );
          const newStyle = this.updateStyle(
            this[variable],
            originalCluster,
            themeCluster
          );
          let styleTag = document.getElementById(id);

          this.test = newStyle;

          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.setAttribute('id', id);
          }
          document.getElementsByTagName('head')[0].insertBefore(styleTag, null);
          styleTag.innerText = newStyle;
        };
      };

      if (!this.chalk) {
      const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
      // const url=`${process.env.BASE_URL}theme/index.css`;
       await this.getCSSString(url, 'chalk');
      }
      const chalkHandler = getHandler('chalk', 'chalk-style');

      chalkHandler();

      const styles = [].slice
        .call(document.querySelectorAll('style'))
        .filter((style) => {
          const text = style.innerText;
          return (
            new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
          );
        });

      styles.forEach((style) => {
        const { innerText } = style;
        if (typeof innerText !== 'string') return;
        style.innerText = this.updateStyle(
          innerText,
          originalCluster,
          themeCluster
        );
      });

      $message.close();
    },
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
      });
      return newStyle;
    },

    getCSSString(url, variable) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
            resolve();
          }
        };
        xhr.open('GET', url);
        xhr.send();
        
      });
    },

    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(',');
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));

          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);

          return `#${red}${green}${blue}`;
        }
      };

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      };

      const clusters = [theme];
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
      }
      clusters.push(shadeColor(theme, 0.1));
      return clusters;
    },
  },
};
</script>
 
<style>
.theme-picker {
  /* float: left; */
  margin-top: 7px;
  vertical-align: middle;
}

.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 20px !important;
  width: 20px !important;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>