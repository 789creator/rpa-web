<template>
  <el-dialog :visible.sync="visible" title="修改" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="status" label="状态">
        <el-select v-model="dataForm.status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
import { update } from '@/api/mission'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        status: 1
      },
      options: [
        {
          value: 0,
          label: '待执行'
        }, {
          value: 1,
          label: '执行中'
        }, {
          value: 2,
          label: '已完成'
        }, {
          value: 3,
          label: '执行失败'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    init () {
      this.visible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].resetFields()
      //   Promise.all([
      //     this.getDeptList(),
      //     this.getRoleList()
      //   ]).then(() => {
      //     if (this.dataForm.id) {
      //       this.getInfo()
      //     }
      //   })
      // })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      update(this.dataForm).then(xhr => {
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
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>

<style lang="scss">
.mod-sys__user {
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
