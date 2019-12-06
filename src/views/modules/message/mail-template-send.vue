<template>
  <el-dialog :visible.sync="visible" :title="$t('mail.send')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="!noEnter && dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="mailTo" :label="$t('mail.mailTo')">
        <el-input v-model="dataForm.mailTo" :placeholder="$t('mail.mailTo')" :disabled="noEditMailTo"></el-input>
      </el-form-item>
      <el-form-item v-if="!isNeedContent" prop="mailCc" :label="$t('mail.mailCc')">
        <el-input v-model="dataForm.mailCc" :placeholder="$t('mail.mailCc')"></el-input>
      </el-form-item>
      <el-form-item v-if="!isNeedContent" prop="params" :label="$t('mail.params')">
        <el-input v-model="dataForm.params" :placeholder="$t('mail.paramsTips')"></el-input>
      </el-form-item>
      <el-form-item v-else prop="content" label="内容">
        <el-input
          v-model="dataForm.content"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 15}"
          placeholder="请输入内容"
        ></el-input>
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
import { isEmail } from '@/utils/validate'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        workId: '',
        mailTo: '',
        mailCc: '',
        params: '',
        content: ''
      }
    }
  },
  props: {
    isNeedContent: {
      type: Boolean,
      default: false
    },
    noEnter: {
      type: Boolean,
      default: false
    },
    noEditMailTo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dataRule () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
        }
        callback()
      }
      return {
        mailTo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$emit('send', this.dataForm)
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
