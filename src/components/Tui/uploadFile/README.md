# TUploadFile简单使用(v1.1.0)

## 1. 简介
  uploadFile组件（基于elementUI图片控件二次封装实现图片文件上传、下载、回显、编辑功能）

## 2. 结构
  #####2.1 用法示例
  ```
                <t-upload-file
                    @uploadSuccess="setFileId"
                    @deleteSuccess="updateFileId"
                    fileType=".jpg,.jpeg,.png,.pdf"
                    setKey="authLetterFileIds"
                    ></t-upload-file>

                <t-upload-file
                  @uploadSuccess="setFileId"
                  @deleteSuccess="updateFileId"
                  fileType=".jpg,.jpeg,.png,.pdf"
                  setKey="bankAcctFileId"
                ></t-upload-file>

                
  ```

#####2.3 用法示例2 回显模块
```
            <t-upload-file 
                    disabled 
                    showOnly="true" 
                    :fileIdList="authLetterFileIds" 
                    :isShowTips="false" 
                    v-if="authLetterFileIds.length>0"
                    ></t-upload-file>
            
```
```
回显图片最好使用 v-if 可以避免某些情况下回显的id未加载，等加载完控件没有触发刷新导致没有回显的问题
```
#####2.3 业务代码中方法示例：
  ```
  @uploadSuccess=
  @deleteSuccess=
  setKey=
  这三个字段结合使用保持上传、删除实时更新业务代码中的绑定属性(TODO:用一个属性功能代替三个)

methods: {
    ...
    // 图片模块 上传后记录ids
    setFileId (data, key) {
      this[key] = data.res
      this.ruleForm[key] = this[key].join(',')
    },
    // 删除后更新ids
    updateFileId (data, key) {
      this[key] = data.res
      this.ruleForm[key] = this[key].join(',')
    }

  ```


## 3. 配置参数

| 参数               | 说明                                                     | 类型      |  是否必须|
| ------------       | --------------------------------                        | -------   | ------- |
| uploadSuccess      | 上传成功的回调，结合setKey使用用于更新业务中的绑定值   | function    | 是    |
| deleteSuccess      | 上传失败的回调，结合setKey使用用于更新业务中的绑定值   | function    | 是    |
| setKey             |         用于更新业务中的绑定值                       | String      | 是    |
| action             | 原插件上传保存图片的地址                               | String      | 否    |
| multiple           |         是否可上传多个文件                           | Boolean     | 否    |
| limit              |         限制上传文件个数                             | Number      | 否    |
| limitSize          | 限制上传文件大小默认10MB                             | String      | 否    |
| fileType           | 限制上传文件类型，用逗号分开 如.jpg,.jpeg             | String      | 否    |
| disabled           | 不可编辑开关                                         | Boolean      | 否    |
| fileNameLimit      | 文件名字长度限制 默认50                               | Number      | 否    |
| fileIdList         | 回显图片的id list逗号分隔                       | Array, String  | 否    |
| isShowTips         | 是否显示底部提示信息                                 | Boolean       | 否    |
