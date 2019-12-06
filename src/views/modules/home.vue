<template>
  <div>
    <el-row class="mb20" :gutter="20">
      <el-col
        class="clearfix home-header-box"
        :span="6"
        v-for="(item, index) in headerItems"
        :key="index"
      >
        <el-card class="header-card">
          <div class="fl text-center header-box-svg mr10">
            <svg class="icon-svg" aria-hidden="true">
              <use :xlink:href="`#${item.svgId}`" />
            </svg>
          </div>
          <div class="header-box-content">
            <div class="m-auto">
              <div class="header-box-content-val mb10">{{item.val}}</div>
              <div class="header-box-content-title">{{item.title}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>工单流转机器人任务量</span>
            <div class="fr bar-chart-legend">
              <div class="dpib mr10">
                <img src="~@/assets/img/chart_bar.png" height="12" alt />
                任务量
              </div>
              <div class="dpib">
                <img src="~@/assets/img/chart_line.png" alt />
                平均值
              </div>
            </div>
          </div>
          <el-form :inline="true">
            <el-form-item>
              <el-select
                class="server-select"
                v-model="form.executeLink"
                size="small"
                placeholder="全部"
              >
                <el-option
                  v-for="item in form.executeLinkKeys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                class="server-select"
                v-model="form.region"
                size="small"
                placeholder="全部"
              >
                <el-option
                  v-for="item in form.regionKeys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="flex-date">
              <el-date-picker
                v-model="form.dateRange"
                type="daterange"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <bar-chart
            :height="chartHeight+'px'"
            :seriesData="robotMissionChart.seriesData"
            :xData="robotMissionChart.xData"
          ></bar-chart>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>机器人运行监控情况</span>
          </div>
          <!-- <pie-chart :height="chartHeight+'px'" :seriesData="robotRunChart.seriesData"></pie-chart> -->
          <div class="home-analyse" :style="{'height': '80px'}">
            <el-row v-for="(item, i) in robotRunChart.tableData" :key="i">
              <el-col :span="18">{{item.title}}</el-col>
              <el-col :span="6">{{item.value}}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>服务器列表</span>
          </div>
          <el-table :height="tableHeight" :data="tableData" style="width: 100%">
            <el-table-column
              v-for="(item,index) in columns"
              :key="index"
              :prop="item.field"
              :label="item.title"
            >
              <template slot-scope="scope">
                <span
                  v-if="item.field=='serverMachineName'"
                >{{scope.row.serverMachineName}}</span>
                <template v-else-if="item.isTag" slot-scope="scope">
                  <el-tag
                    size="small"
                    :type="item.formatter(scope.row[item.field]).type"
                  >{{item.formatter(scope.row[item.field]).value}}</el-tag>
                </template>
                <span
                  v-else
                >{{item.formatter?item.formatter(scope.row[item.field]):scope.row[item.field]}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pieChart from '@/components/Charts/PieChart'
import barChart from '@/components/Charts/barChart'
import { getServerList, getServerStatus } from '@/api/server'
import { getWorkOrderStatus } from '@/api/mission'
import { getAnalyse, getAnalyseByWeek } from '@/api/home'
import { cleanNull, parseTime } from '@/utils/index'
export default {
  data () {
    return {
      tableData: [],
      tableHeight: 0,
      chartHeight: 0,
      form: {
        dateRange: null,
        executeLink: '',
        region: '',
        executeLinkKeys: (() => {
          return new Array(5).fill(1).map((e, i) => ({
            value: i || '',
            label: i ? `环节${i}` : '全部'
          }))
        })(),
        regionKeys: (() => {
          return ',成分,绵阳,自贡,攀枝花,泸州分公司,德阳,广元,遂宁,内江,乐山,资阳,宜宾,南充,达州,雅安,广安,巴中,眉山,甘分,凉山'.split(',').map(e => ({
            value: e,
            label: e || '全部'
          }))
        })()
      },
      headerItems: [
        {
          title: '服务器运行中',
          svgId: 'iconhuojian',
          type: 'server',
          status: 1,
          val: ''
        },
        {
          title: '服务器空闲',
          svgId: 'iconclock',
          type: 'server',
          status: 0,
          val: ''
        },
        {
          title: '流程队列',
          svgId: 'iconwodeduilie-',
          type: 'mission',
          status: 0,
          val: ''
        },
        {
          title: '执行任务数',
          svgId: 'iconali-flows',
          type: 'mission',
          status: 1,
          val: ''
        }
      ],
      robotMissionChart: {
        seriesData: [],
        xData: []
      },
      robotRunChart: {
        tableData: [],
        columns: [
          {
            title: '标题',
            field: 'title'
          },
          {
            title: '数值',
            field: 'value',
            width: '70px'
          }
        ]
        // seriesData: [[], [], []]
      },
      columns: [
        {
          field: 'serverMachineName',
          title: '服务器名'
        },
        {
          field: 'serverIp',
          title: '服务器ip'
        },
        {
          field: 'serverVersion',
          title: '服务器版本'
        },
        {
          field: 'status',
          title: '当前状态',
          isTag: true,
          formatter (val) {
            if (val === 0) {
              return {
                value: '空闲',
                type: 'success'
              }
            } else if (val === 1) {
              return {
                value: '占用',
                type: 'danger'
              }
            } else {
              return {
                value: val
              }
            }
          }
        }
      ]
    }
  },
  created () {},
  components: {
    pieChart,
    barChart
  },
  beforeMount () {
    this.resize()
  },
  mounted () {
    this.getHeaderNums()
    getAnalyse({
      // 传参：今日0时
      analyseDate:
        new Date(parseTime(new Date(), '{y}-{m}-{d}')).getTime() -
        8 * 60 * 60 * 1000
    }).then(xhr => {
      console.log(xhr)
      // this.robotRunChart.seriesData = [[150, 40], [95, 20], [4, 1]]
      this.robotRunChart.tableData = [
        {
          title: '执行效率(条/时)',
          value: xhr.data.data.efficiency
        },
        {
          title: '执行成功率',
          value: xhr.data.data.successRatio
        },
        {
          title: '平均运行时长(分钟/条)',
          value: xhr.data.data.exeTime
        }
      ]
    })
    getServerList({
      status: ''
    }).then(xhr => {
      this.tableData = cleanNull(xhr.data.data.records, '-')
    })
    window.addEventListener('resize', this.resize)
  },
  computed: {},
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler (val) {
        this.getAnalyseByDate()
      }
    }
  },
  methods: {
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      this.tableHeight = windowHeight - 298
      // this.chartHeight = (windowHeight - 385) / 2
      this.chartHeight = windowHeight - 528
    },
    getAnalyseByDate () {
      let postData = {}
      if (this.form.dateRange) {
        postData.startDate = this.form.dateRange[0]
        postData.endDate = this.form.dateRange[1]
      }
      if (this.form.executeLink) {
        postData.executeLink = this.form.executeLink
      }
      if (this.form.region) {
        postData.region = this.form.region
      }
      getAnalyseByWeek(postData).then(xhr => {
        const xData = xhr.data.data.dataList.map(
          item => item.fileReceiveDate
        )
        this.robotMissionChart.xData = []
        this.robotMissionChart.seriesData = []
        let sD, eD
        if (this.form.dateRange) {
          [sD, eD] = this.form.dateRange
        } else {
          sD = xData[0]
          eD = xData[xData.length - 1]
        }
        const eT = new Date(eD).getTime()
        const sT = new Date(sD).getTime()
        const days = (eT - sT) / 1000 / 3600 / 24
        for (let i = 0; i <= days; i++) {
          let date = parseTime(sT + i * 24 * 3600 * 1000, '{y}-{m}-{d}')
          this.robotMissionChart.xData.push(date)
          if (xData.includes(date)) {
            const val = xhr.data.data.dataList.find(e => e.fileReceiveDate === date).workOrderNumByDay || 0
            this.robotMissionChart.seriesData.push(val)
          } else {
            this.robotMissionChart.seriesData.push(0)
          }
        }
      })
    },
    getHeaderNums () {
      getServerStatus().then(xhr => {
        xhr.data.data.forEach(item => {
          this.headerItems.find(headerItem => {
            return (
              headerItem.type === 'server' && headerItem.status === item.status
            )
          }).val = item.num
        })
      })
      getWorkOrderStatus().then(xhr => {
        xhr.data.data.forEach(item => {
          let headerItem = this.headerItems.find(headerItem => {
            return (
              headerItem.type === 'mission' && headerItem.status === item.status
            )
          })
          if (headerItem) {
            headerItem.val = item.num
          }
        })
      })
    },
    getSysInfo () {
      this.$http
        .get('/sys/info')
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.sysInfo = res.data
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin linear-gradient($color1,$color2){
  background: -webkit-linear-gradient($color1 , $color2); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient($color1, $color2); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient($color1, $color2); /* Firefox 3.6 - 15 */
  background: linear-gradient($color1 , $color2); /* 标准的语法 */
}
.bar-chart-legend {
  font-size: 12px;
  color: #6d6e75;
}
.home-analyse {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
}
.el-form{
  display: flex;
  justify-content: space-between;
  &-item{
    flex: 1;
    overflow: hidden;
    &.flex-date{
      flex: 2.5 !important;
    }
  }
}
.el-date-editor{
  width: 100%;
}
.home-header-box{
  &:nth-child(1){
    .header-box-svg{
      @include linear-gradient(#DCE4FF, #3663FE);
      box-shadow: 0 2px 6px 0 #577AFB;
    }
  }
  &:nth-child(2){
    .header-box-svg{
      @include linear-gradient(#CCEBF8, #0990FF);
      box-shadow: 0 2px 4px 0 #269EFF;
    }
  }
  &:nth-child(3){
    .header-box-svg{
      @include linear-gradient(#EBD3FD, #A258F2);
      box-shadow: 0 2px 8px 0 #A963F4;
    }
  }
  &:nth-child(4){
    .header-box-svg{
      @include linear-gradient(#E1FFC6, #4CBF14);
      box-shadow: 0 2px 3px 0 #6CCC39;
    }
  }
}
</style>
