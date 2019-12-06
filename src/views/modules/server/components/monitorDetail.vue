<template>
  <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="90%"
    v-loading="loading"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-row class="mb20" :gutter="40">
      <el-col :span="12" v-for="(item, i) in charts" :key="i">
        <div class="pd15">
          <div class="title">
            <span>{{item.title}}</span>
            <el-date-picker
              v-model="item.date"
              type="datetimerange"
              :align="item.align"
              size="small"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <line-chart-data-zoom height="300px" v-if="item.seriesData.length" :xData="item.xAxis" :seriesData="item.seriesData"></line-chart-data-zoom>
          <div class="no-chart" v-else>暂无数据</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" v-for="(tableData, i) in tables" :key="i">
        <div class="pd15">
          <el-table :data="tableData" :show-header="false">
            <el-table-column
              v-for="(item, j) in columns"
              :key="j"
              :width="item.width"
              :prop="item.field"
              :label="item.title"
            >
              <template slot-scope="scope">
                {{formatField(item, scope.row)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import lineChartDataZoom from '@/components/Charts/lineChartDataZoom'
import { getCpuData, getMemoryData } from '@/api/monitor'
import { parseTime } from '@/utils'
export default {
  components: {
    lineChartDataZoom
  },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      detailData: {
        sysTime: '',
        osName: '',
        osArch: '',
        osVersion: '',
        userLanguage: '',
        userDir: '',
        totalPhysical: '',
        freePhysical: '',
        memoryRate: '',
        processors: '',
        jvmName: '',
        javaVersion: '',
        javaHome: '',
        javaTotalMemory: '',
        javaFreeMemory: '',
        javaMaxMemory: '',
        userName: '',
        systemCpuLoad: '',
        userTimezone: '',
        currentDiskTotalSpace: '',
        currentDiskFreeSpace: '',
        currentDiskUsageRate: '',
        serverIp: ''
      },
      columns: [
        {
          title: '',
          field: 'title',
          width: 120
        },
        {
          title: '',
          field: 'value'
        }
      ],
      tables: [
        [
          { title: '服务器IP', field: 'serverIp' },
          { title: '操作系统', field: 'osName' },
          { title: '系统版本', field: 'osVersion' },
          { title: '系统架构', field: 'osArch' },
          { title: 'CPU核数', field: 'processors' },
          {
            title: '系统内存',
            field: 'totalPhysical',
            formatter (val) {
              return val + 'MB'
            }
          },
          {
            title: '剩余内存',
            field: 'freePhysical',
            formatter (val) {
              return val + 'MB'
            }
          },
          {
            title: '内存使用',
            field: 'memoryRate',
            formatter (val) {
              return val + '%'
            }
          },
          { title: '当前用户', field: 'userName' },
          {
            title: 'CPU负载',
            field: 'systemCpuLoad',
            formatter (val) {
              return val + '%'
            }
          },
          { title: '系统语言', field: 'userLanguage' },
          { title: '系统时区', field: 'userTimezone' }
        ],
        [
          { title: 'JVM信息', field: 'jvmName' },
          { title: 'JVM版本', field: 'javaVersion' },
          { title: 'JAVA_HOME', field: 'javaHome' },
          { title: '工作目录', field: 'userDir' },
          {
            title: 'JVM占用内存',
            field: 'javaTotalMemory',
            formatter (val) {
              return val + 'MB'
            }
          },
          {
            title: 'JVM空闲内存',
            field: 'javaFreeMemory',
            formatter (val) {
              return val + 'MB'
            }
          },
          {
            title: 'JVM最大内存',
            field: 'javaMaxMemory',
            formatter (val) {
              return val + 'MB'
            }
          },
          {
            title: '磁盘总容量',
            field: 'currentDiskTotalSpace',
            formatter (val) {
              return Math.round(val / 1024) + 'GB'
            }
          },
          {
            title: '磁盘已用空间',
            field: 'currentDiskFreeSpace',
            formatter: () => {
              return Math.round((this.detailData.currentDiskTotalSpace - this.detailData.currentDiskFreeSpace) / 1024) + 'GB'
            }
          },
          {
            title: '磁盘可用空间',
            field: 'currentDiskFreeSpace',
            formatter (val) {
              return Math.round(val / 1024) + 'GB'
            }
          },
          {
            title: '磁盘已使用',
            field: 'currentDiskUsageRate',
            formatter (val) {
              return val + '%'
            }
          }
        ]
      ],
      charts: [
        {
          title: 'CPU',
          date: '',
          align: 'left',
          xAxis: [],
          seriesData: []
        },
        {
          title: '内存',
          date: '',
          align: 'right',
          xAxis: [],
          seriesData: []
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '昨天',
            onClick (picker) {
              const today = new Date(parseTime(new Date(), '{y}-{m}-{d}')) - 8 * 60 * 60 * 1000
              const start = today - 3600 * 1000 * 24
              const end = today - 1000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '今天',
            onClick (picker) {
              const end = new Date()
              const start = new Date(parseTime(new Date(), '{y}-{m}-{d}')) - 8 * 60 * 60 * 1000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick (picker) {
              const today = new Date(parseTime(new Date(), '{y}-{m}-{d}')) - 8 * 60 * 60 * 1000
              const start = today - 3600 * 1000 * 24 * 6
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick (picker) {
              const today = new Date(parseTime(new Date(), '{y}-{m}-{d}')) - 8 * 60 * 60 * 1000
              const start = today - 3600 * 1000 * 24 * 29
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  watch: {
    'charts.0.date' ([start, end]) {
      this.loading = true
      const postData = {
        startTime: parseTime(start),
        endTime: parseTime(end),
        page: 1,
        limit: 100,
        serverIp: this.detailData.serverIp
      }
      getCpuData(postData).then(xhr => {
        this.loading = false
        this.charts[0].xAxis = xhr.data.data.records.map(item => item.createTime)
        this.charts[0].seriesData = xhr.data.data.records.map(item => item.value)
      })
    },
    'charts.1.date' ([start, end]) {
      this.loading = true
      const postData = {
        startTime: parseTime(start),
        endTime: parseTime(end),
        page: 1,
        limit: 100,
        serverIp: this.detailData.serverIp
      }
      getCpuData(postData).then(xhr => {
        this.loading = false
        this.charts[1].xAxis = xhr.data.data.records.map(item => item.createTime)
        this.charts[1].seriesData = xhr.data.data.records.map(item => item.value)
      })
    }
  },
  methods: {
    show (row) {
      this.dialogVisible = true
      this.loading = true
      Object.assign(this.detailData, row)
      const start = new Date(parseTime(new Date(), '{y}-{m}-{d}')) - 8 * 60 * 60 * 1000
      const end = new Date().getTime()
      this.charts.forEach(item => {
        item.date = [start, end]
      })
      const postData = {
        startTime: parseTime(start),
        endTime: parseTime(end),
        page: 1,
        limit: 100,
        serverIp: row.serverIp
      }
      Promise.all([getCpuData(postData), getMemoryData(postData)]).then(([xhr1, xhr2]) => {
        this.charts[0].xAxis = xhr1.data.data.records.map(item => item.createTime)
        this.charts[0].seriesData = xhr1.data.data.records.map(item => item.value)
        this.charts[1].xAxis = xhr2.data.data.records.map(item => item.createTime)
        this.charts[1].seriesData = xhr2.data.data.records.map(item => item.value)
      }).finally(_ => {
        this.loading = false
      })
    },
    handleClose (done) {
      done()
    },
    formatField (column, row) {
      if (column.field === 'title') {
        return row.title
      } else {
        return row.formatter ? row.formatter(this.detailData[row.field], row) : this.detailData[row.field]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-date-editor {
  width: 356px;
  // float: right;
  margin: 0 5px;
}
.pd15 {
  padding: 0 15px 15px;
}
.title {
  font-size: 18px;
}
.no-chart{
  height: 300px;
  line-height: 300px;
  text-align: center;
}
</style>
