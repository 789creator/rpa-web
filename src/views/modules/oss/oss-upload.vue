<template>
  <el-dialog :visible.sync="visible" :title="$t('oss.upload')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload
      :action="url"
      :file-list="fileList"
      drag
      multiple
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      class="text-center">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <div class="el-upload__tip" slot="tip">{{ $t('upload.tip', { 'format': fileTypesStr }) }}</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      visible: false,
      url: '',
      num: 0,
      fileList: []
    }
  },
  props: {
    fileTypes: {
      type: Array,
      default: () => ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
    },
    fileTypesStr: {
      type: String,
      default: 'jpg、png、gif'
    }
  },
  methods: {
    init () {
      this.visible = true
      this.url = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`
      this.num = 0
      this.fileList = []
    },
    // 上传之前
    beforeUploadHandle (file) {
      console.log(file.type)
      if (!this.fileTypes.includes(file.type)) {
        this.$message.error(this.$t('upload.tip', { 'format': this.fileTypesStr }))
        return false
      }
      this.num++
    },
    // 上传成功
    successHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.fileList = fileList
      this.num--
      if (this.num === 0) {
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList', fileList)
          }
        })
      }
    }
  }
}
</script>
