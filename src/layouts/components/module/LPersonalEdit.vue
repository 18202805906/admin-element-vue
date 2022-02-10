<template>
  <el-dialog title="修改密码" :visible="value" @close="handleCancel" :close-on-press-escape="false" append-to-body :close-on-click-modal="false" width="500px">
    <t-simple-form
          :ref-obj.sync="formOpts.ref"
          :formOpts="formOpts"
          :widthSize="1"
    />
    <div slot="footer" class="text-center">
      <el-button
        :loading="loading"
        @click="updatePsd('updatePsdForm')"
        type="primary"
        icon="el-icon-check"
      >提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cryptoPassword } from '@/utils';
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let validateNewPassword = (rule, value, callback) => {
      let regx = new RegExp(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,15}$)/);
      if (regx.test(value)) {
        callback();
      } else {
        callback(new Error('长度至少8位，至少一个大写字母，一个小写字母，一个特殊字符，一个数字！'));
      }
    };
    let validateRePassword = (rule, value, callback) => {
		if (value !== this.formOpts.formData.newPassword) {
			callback(new Error('两次输入的新密码不一致'));
		} else {
			callback();
		}
    };
    return {
		loading: false,
     // form表单
    formOpts: {
      ref: null,
      labelWidth: '100px',
      formData: {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      },
      fieldList: [
         { label: '原始密码:', value: 'oldPassword', type: 'password', comp: 'el-input' },
          { label: '新密码:', value: 'newPassword', type: 'password', comp: 'el-input' },
          { label: '重复密码:', value: 'reNewPassword', type: 'password', comp: 'el-input'}
      ],
      rules: {
        oldPassword: [
				{
					type: 'string',
					required: true,
					trigger: 'blur',
					message: '请输入原始密码'
				}
			],
			newPassword: [
				{
					type: 'string',
					required: true,
					trigger: 'blur',
					message: '请输入新密码'
				},
				{ validator: validateNewPassword }
			],
          reNewPassword: [
				{
					type: 'string',
					required: true,
					trigger: 'blur',
					message: '请再次输入密码'
				},
				{ validator: validateRePassword }
			]
        },
    }
    };
  },
  methods: {
    handleCancel() {
      this.$emit('input', false);
    },
    updatePsd() {
      this.formOpts.ref.validate((valid) => {
        if (valid) {
          this.loading = true;
          let { oldPassword, newPassword, reNewPassword } = this.formOpts.formData;
          let params = {
            oldPassword: cryptoPassword(oldPassword),
            newPassword: cryptoPassword(newPassword),
            reNewPassword: cryptoPassword(reNewPassword)
          };
          console.log(params);
          this.$message.success('操作成功！');
          this.handleCancel();
        } else {
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>