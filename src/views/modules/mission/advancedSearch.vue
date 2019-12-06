<template>
  <el-dialog
    title="高级搜索"
    :visible.sync="dialogVisible"
    width="400"
  >
    <el-form>
      <el-form-item>
        <el-select class="mr10" v-model="form.timeType" size="small" placeholder="请选择">
          <el-option
            v-for="item in timeSelectKeys"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-date-picker
          v-model="form.dateRange"
          value-format="timestamp"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { parseTime } from '@/utils'
export default {
  data () {
    return {
      dialogVisible: false,
      resolve: '',
      reject: '',
      form: {
        timeType: 'executeStartTime',
        dateRange: null
      },
      timeSelectKeys: [
        {
          value: 'executeStartTime',
          label: '开始时间'
        }, {
          value: 'executeEndTime',
          label: '结束时间'
        }, {
          value: 'fileReceiveTime',
          label: '创建时间'
        }
      ]
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    search () {
      const [startTime, endTime] = this.form.dateRange || ['', '']
      let tags = []
      let timeType = ''
      if (startTime || endTime) {
        timeType = this.form.timeType
        tags.push({
          name: `${this.timeSelectKeys.find(e => e.value === timeType).label}:${parseTime(startTime, '{y}-{m}-{d}')}至${parseTime(endTime, '{y}-{m}-{d}')}`
        })
      }
      this.resolve({
        tags,
        timeType,
        startTime,
        endTime
      })
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 120px;
}
.el-date-editor{
  width: 300px;
}
</style>
