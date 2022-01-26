
<template>
  <div class="upload-file-container-outer">
    <div class="upload-file-container">
      <el-upload
        v-loading="loading"
        :class="{hide:hideUpload}"
        :action="savePath"
        :multiple="multiple"
        :list-type="listType"
        :on-change="fileListChange"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :on-preview="onPreview"
        :on-remove="onRemove"
        :accept="fileType"
        :disabled="disabled"
        :limit="limit"
        :file-list="showFileList"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <i slot="default" v-if="listType == 'picture-card'" class="el-icon-plus"></i>
        <el-button :size="uploadBtn.size" class="el-icon-upload" v-else type="primary">{{uploadBtn.text}}</el-button>
        <div class="upload-file-tips" slot="tip" v-if="isShowTips">
          仅允许上传类型为{{fileType}},文件名不超过{{fileNameLimit}}位，并且不大于{{limitSize}}MB的文件。
        </div>
        <div class="el-upload-list__item" style="position:relative" slot="file" slot-scope="{file}">
          <img
            :src="file.url"
            class="el-upload-list__item-thumbnail pointer"
            alt
            v-if="isImgReg.test(file.name)"
          />
          <!-- <img
            :src="downloadFixedIcon(file.name)"
            class="el-upload-list__item-thumbnail pointer"
            alt
            v-else
          /> -->
          <p class="text-center file-name-style" v-if="!isImgReg.test(file.name)">{{file.name}}</p>
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="onPreview4show(isImgReg.test(file.name)?file.url:downloadFixedIcon(file.name))"
              v-if="isImgReg.test(file.name)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <!-- <span class="el-upload-list__item-delete" @click="downloadFile(file.id)"> -->
            <span class="el-upload-list__item-delete">
              <i class="el-icon-download"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="onRemove(file)" v-if="!disabled">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>
<script>
/**
 *  图片上传控件
 *  uploadFile
 *
 */
export default {
  name: 'TUploadFile',
  data () {
    return {
      loading: false,
      startTime: '',
      endTime: '',
      isImgReg: /.png|.jpg|.jpeg|.PNG|.JPG|.JPEG/,
      url: '',
      hideUpload: false,
      showAddImg: true,
      dialogImageUrl: '', // 上传图片后预览预判地址
      dialogVisible: false, // 放大图片弹框
      singleResult: {}, // 单次返回报文结果
      showFileList: [],
      downloadFixedIcons: [
        { type: 0, url: '' },
        { type: 1, url: '' },
        { type: 2, url: '' },
        { type: 3, url: '' },
        { type: 4, url: '' },
        { type: 5, url: '' },
        { type: 6, url: '' },
        { type: 7, url: '' }
      ]
    };
  },
  props: {
    // 通过按钮上传配置
    uploadBtn: {
      type: Object,
      default: () =>{
        return {
          text: '点击上传',
          size: 'small'
        };
      }
    },
     // 上传显示类型
    listType: {
      type: String,
      default: 'picture-card'
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 限制上传文件大小默认10MB
    limitSize: {
      type: String,
      default: '10'
    },
    // 上传图片个数限制
    limit: {
      type: Number,
      default: 100
    },
    // 限制上传的文件类型
    fileType: {
      type: String,
      default:
        '.jpg,.jpeg,.bmp,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.rar,.zip'
    },
    savePath: {
      type: String,
      default: ''
    },
    fileUploadAddr: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 文件名字长度限制
    fileNameLimit: {
      type: Number,
      default: 50
    },
    // 回显图片的list
    fileIdList: {
      type: [Array, String],
      default: () => {
        return [];
      }
    },
    // 当前文件id存入的key
    setKey: {
      type: String,
      default: null
    },
    isShowTips: {
      type: Boolean,
      default: true
    },
  },
  mounted () {
    // 控制上传按钮
    if (this.disabled) {
      this.hideUpload = true;
    }
  },
  methods: {
    beforeUpload (file) {
      const overSize = file.size / (1024 * 1024) > this.limitSize;
      const overFileNameLength = file.name.length > this.fileNameLimit;
      // 校验文件名是否合法 当前规则不能含有空格
      const fileNameUnlawful = /\s/.test(file.name);
      const type = file.name
        .slice(file.name.lastIndexOf('.') + 1)
        .toLocaleLowerCase();
      const isNotMatchType = this.fileType.indexOf('.' + type) === -1;
      if (overSize) {
        this.$message.error('上传文件不得大于' + this.limitSize + 'MB');
      }
      if (fileNameUnlawful) {
        this.$message.error('上传文件名称不得含有空格');
      }
      if (overFileNameLength) {
        this.$message.error(
          '上传文件名称不得大于' + this.fileNameLimit + '位字符'
        );
      }
      if (isNotMatchType) {
        this.$message.error('上传文件类型不符合要求');
      }
      return !(
        overSize ||
        overFileNameLength ||
        isNotMatchType ||
        fileNameUnlawful
      );
    },
    handleSuccess (res, file, fileList) {
      const successData = {
        res: this.findIdList(this.showFileList)
      };

      this.$emit('uploadSuccess', successData, this.setKey);
    },
    onPreview (file) {
      // 放大
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onPreview4show (url) {
      // 放大,回显部分
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    findIdList (list) {
      return list.map(item => {
        return item.id;
      });
    },
    async onRemove (file, fileList) {
      const deleteId = file.id;
      /* if (deleteId) {
        await this.$ajaxRequest('POST', 'deleteFile', {
          fileId: deleteId
        })
      } */
      const tempList = this.showFileList;
      tempList.forEach((item, index) => {
        if (item.id === deleteId) {
          this.showFileList.splice(index, 1);
        }
      });
      // 输出
      const Idlist = this.findIdList(this.showFileList);
      this.$emit('deleteSuccess', { res: Idlist }, this.setKey);
      // 删除不会调用onchange所以这里也需要主动调用
      this.hideUpload = this.showFileList.length >= this.limit;
    },
    // 返回显示文件图标的地址函数
    downloadFixedIcon (item) {
      if (/.bmp|.gif/.test(item)) {
        return this.downloadFixedIcons[0].url;
      } else if (/.doc|.docx/.test(item)) {
        return this.downloadFixedIcons[1].url;
      } else if (/.xls|.xlsx/.test(item)) {
        return this.downloadFixedIcons[3].url;
      } else if (/.txt/.test(item)) {
        return this.downloadFixedIcons[4].url;
      } else if (/.pdf/.test(item)) {
        return this.downloadFixedIcons[5].url;
      } else if (/.zip/.test(item)) {
        return this.downloadFixedIcons[6].url;
      } else if (/.rar/.test(item)) {
        return this.downloadFixedIcons[6].url;
      }
    },
    // 下载文件
    async downloadFile (fileId) {
      const res = await this.$ajaxRequest('DOWNLOAD', 'downloadFile', {
        fileId
        /*  id: fileId,
         hideLoading: true */
      });

      if (res.head && res.head.resCode === '000000') {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = res.data.downloadUrl;
        link.download = res.data.fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      }
      // downloadFile(res, res.filename)
    },
    fileListChange (f, fileList) {
      // 添加文件上传成功、失败都会调用on-change
      this.hideUpload = fileList.length >= this.limit;
    }
  }
};
</script>
<style lang="scss">
.upload-file-container-outer {
  .upload-file-container {
    padding: 5px;
    .hide .el-upload--picture-card {
      display: none;
    }
    .file-name-style {
      position: absolute;
      top: 50%;
      width: 100%;
      color: #000;
    }
  }
  .upload-file-tips {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    line-height: 16px;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
