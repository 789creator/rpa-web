<template>
  <div v-loading="loading" class="server-monitor">
    <div class="mb20">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="nowrap">状态</span>
        </div>
        <monitor-charts :list="chartsList"></monitor-charts>
      </el-card>
    </div>
    <div>
      <el-card>
        <el-table
          ref="table"
          :height="tableHeight"
          :data="tableData"
          highlight-current-row
          style="width: 100%"
          @row-click="rowClick"
          @row-dblclick="showDetail"
        >
          <el-table-column
            v-for="(item,index) in columns"
            :key="index"
            :prop="item.field"
            :label="item.title"
          >
            <template slot-scope="scope">
              <span v-if="index==0" style="color:#fff">{{cleanNull(scope.row[item.field], '-')}}</span>
              <div v-else-if="item.group">
                <div v-for="(innerItem, j) in item.group" :key="j">
                  <el-button
                    v-if="innerItem.type=='button'"
                    type="text"
                    size="small"
                    @click.stop="innerItem.clickHandler(scope.row)"
                  >{{innerItem.title}}</el-button>
                </div>
              </div>
              <template v-else-if="item.isTag" slot-scope="scope">
                <el-tag
                  size="small"
                  :type="item.formatter(scope.row[item.field]).type"
                >{{item.formatter(scope.row[item.field]).value}}</el-tag>
              </template>
              <template v-else-if="item.field=='systemCpuLoad'" slot-scope="scope">
                <div class="cpu-box">
                  <div class="cpu-inner" :style="{'width':scope.row[item.field]+'%'}"></div>
                </div>
              </template>
              <template v-else-if="item.field=='memoryRate'" slot-scope="scope">
                <div class="css-pie">
                  <div v-if="scope.row[item.field] <= 50" class="css-pie-inner css-pie-inner-1" :style="{'-webkit-transform':`rotate(${scope.row[item.field]/100}turn)`,'-ms-transform':`rotate(${scope.row[item.field]/100}turn)`,'transform':`rotate(${scope.row[item.field]/100}turn)`}"></div>
                  <div v-else class="css-pie-inner css-pie-inner-2" :style="{'-webkit-transform':`rotate(${scope.row[item.field]/100-0.5}turn)`,'-ms-transform':`rotate(${scope.row[item.field]/100-0.5}turn)`,'transform':`rotate(${scope.row[item.field]/100-0.5}turn)`}"></div>
                </div>
              </template>
              <span
                v-else
              >{{item.formatter?item.formatter(scope.row[item.field]):cleanNull(scope.row[item.field], '-')}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
        ></el-pagination>
      </el-card>
    </div>
    <monitor-detail ref="monitorDetail"></monitor-detail>
  </div>
</template>

<script>
import monitorCharts from './components/monitorCharts'
import monitorDetail from './components/monitorDetail'
import tablePaginationNormal from '@/mixins/table-pagination-normal'
import { getMonitorList } from '@/api/monitor'
import { cleanNull } from '@/utils/index'
export default {
  mixins: [tablePaginationNormal],
  components: {
    monitorCharts,
    monitorDetail
  },
  data () {
    return {
      tableHeight: 0,
      dialogVisible: true,
      loading: false,
      timer: null,
      chartsList: [
        // {
        //   title: '负载状态',
        //   describe: '运行堵塞',
        //   seriesData: [99, 1]
        // },
        {
          title: 'CPU使用率',
          field: 'systemCpuLoad',
          describe: '',
          seriesData: []
        },
        {
          title: '内存使用率',
          field: 'memoryRate',
          describe: '',
          seriesData: []
        },
        // {
        //   title: '/',
        //   describe: '26G/84G',
        //   seriesData: [26, 84 - 26]
        // },
        {
          title: '',
          describe: '',
          field: 'currentDiskUsageRate',
          seriesData: []
        }
      ],
      columns: [
        {
          title: '服务器IP',
          field: 'serverIp'
        },
        {
          title: '系统名称',
          field: 'osName'
        },
        {
          title: 'CPU使用率',
          field: 'systemCpuLoad'
        },
        {
          title: '内存使用率',
          field: 'memoryRate'
        },
        {
          title: '',
          group: [
            {
              title: '详情',
              type: 'button',
              clickHandler: this.showDetail
            }
          ]
        }
      ],
      tableData: []
    }
  },
  beforeMount () {
    this.resize()
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.getList()
    this.timer = setInterval(() => {
      this.getList(true)
    }, 20000)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    window.clearInterval(this.timer)
  },
  methods: {
    cleanNull,
    showDetail (row) {
      this.$refs.table.setCurrentRow(row)
      this.$refs.monitorDetail.show(row)
    },
    rowClick (row) {
      row && this.resetHeaderCharts(row)
    },
    resetHeaderCharts (row) {
      Object.assign(this.chartsList.find(e => e.field === 'systemCpuLoad'), {
        describe: row.processors + '核心',
        seriesData: [row.systemCpuLoad, 100 - row.systemCpuLoad]
      })
      Object.assign(this.chartsList.find(e => e.field === 'memoryRate'), {
        seriesData: [row.memoryRate, 100 - row.memoryRate]
      })
      Object.assign(
        this.chartsList.find(e => e.field === 'currentDiskUsageRate'),
        {
          title: row.currentDisk,
          describe: `${Math.round(
            (row.currentDiskTotalSpace - row.currentDiskFreeSpace) / 1024
          )}G/${Math.round(row.currentDiskTotalSpace / 1024)}G`,
          seriesData: [
            row.currentDiskTotalSpace - row.currentDiskFreeSpace,
            +row.currentDiskFreeSpace
          ]
        }
      )
    },
    getList (noLoading = false) {
      if (!noLoading) {
        this.loading = true
      }
      getMonitorList({
        page: this.page,
        limit: this.limit
      })
        .then(xhr => {
          this.tableData = xhr.data.data.list
          this.total = +xhr.data.data.total
          this.$refs.table.setCurrentRow(this.tableData[0])
          this.rowClick(this.tableData[0])
        })
        .finally(xhr => {
          this.loading = false
        })
    },
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      this.tableHeight = windowHeight - 445
    }
  }
}
</script>
<style lang="scss" scoped>
$blue: #4895ff;
$bg: #1c2340;
.cpu-box {
  height: 8px;
  width: 50%;
  border-radius: 4px;
  border: 1px solid $blue;
}
.cpu-inner {
  height: 100%;
  background: $blue;
}
.css-pie {
  border-radius: 50%;
  background: $bg;
  background-image: -webkit-linear-gradient(left, $bg 50%, $blue 0);
  background-image: linear-gradient(to right, $bg 50%, $blue 0);
  width: 30px;
  height: 30px;
  border: 2px solid $blue;
  &-inner{
    margin-left: 50%;
    display: block;
    border-radius: 0 100% 100% 0 / 50%;
    -webkit-transform-origin: left;
    -ms-transform-origin: left;
    transform-origin: left;
    height: 100%;
    &-1{
      background-color: $bg;
    }
    &-2{
      background-color: $blue;
    }
  }
}
</style>
