<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item prop="templateName" :label="$t('mail.name')">
        <el-input v-model="dataForm.templateName" :placeholder="$t('mail.name')"></el-input>
      </el-form-item>
      <el-form-item prop="templateContent" :label="$t('mail.content')">
        <el-input type="textarea" v-model="dataForm.templateContent"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import 'quill/dist/quill.snow.css'
import { editTemplate, getTemplateById } from '@/api/sms'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        templateName: '',
        templateContent: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        templateName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        templateContent: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      getTemplateById(this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = res.data
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        editTemplate((!this.dataForm.id ? 'post' : 'put'), { data: this.dataForm }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
