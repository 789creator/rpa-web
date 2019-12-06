<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card>
          <div slot="header" class="clearfix">
            <span>机器人列表</span>
          </div>
          <div>
            <el-form :inline="true" :modal="form" class="demo-form-inline">
              <el-form-item>
                <el-select class="server-select" v-model="form.selectKeysValue" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in form.selectKeys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  class="server-input"
                  v-model="form.input"
                  size="small"
                  placeholder="请输入内容"
                  clearable
                  @keyup.enter.native="search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select class="server-select" v-model="form.statusKeysValue" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in form.statusKeys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select class="server-select" v-model="form.isOnlineValue" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in form.isOnlineKeys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table ref="serverTable" :height="mainTableHeight" :data="serverList.tableData" highlight-current-row style="width: 100%" @current-change="rowClick">
            <el-table-column v-for="(item,index) in serverList.columns" :key="index" :prop="item.field" :label="item.title">
              <template slot-scope="scope">
                <span v-if="item.field=='serverMachineName'" style="color:#fff">
                  {{cleanNull(scope.row.serverMachineName, '-')}}
                </span>
                <div v-else-if="item.group">
                  <div v-for="(innerItem, j) in item.group" :key="j">
                    <el-button v-if="innerItem.type=='button'" type="text" size="small" @click.stop="innerItem.clickHandler(scope.row)">{{innerItem.title}}</el-button>
                  </div>
                </div>
                <template v-else-if="item.isTag" slot-scope="scope">
                  <el-tag size="small" :type="item.formatter(scope.row[item.field]).type">{{item.formatter(scope.row[item.field]).value}}</el-tag>
                </template>
                <span v-else>{{item.formatter?item.formatter(scope.row[item.field]):cleanNull(scope.row[item.field], '-')}}</span>
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
            @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :class="{'moving': isClick, 'premove': isPremove}" :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="nowrap">正在执行任务</span>
          </div>
          <el-table height="120" :data="serverDoing.tableData" style="width: 100%">
            <el-table-column v-for="(item,index) in serverDoing.columns" :key="index" :prop="item.field" :label="item.title" :show-overflow-tooltip="item.isShowTooltip">
              <template slot-scope="scope">
                <span>{{item.formatter?item.formatter(scope.row[item.field]):cleanNull(scope.row[item.field], '-')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span class="nowrap">历史任务</span>
          </div>
          <el-table :height="miniTableHeight" :data="serverHistory.tableData" style="width: 100%">
            <el-table-column v-for="(item,index) in serverHistory.columns" :key="index" :prop="item.field" :label="item.title" :show-overflow-tooltip="item.isShowTooltip">
              <template slot-scope="scope">
                <span>{{item.formatter?item.formatter(scope.row[item.field]):cleanNull(scope.row[item.field], '-')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <add-or-modify v-if="addOrModifyVisible" ref="addOrModify" @refreshDataList="getList"></add-or-modify>
  </div>
</template>

<script>
import addOrModify from './addOrModify'
import tablePaginationNormal from '@/mixins/table-pagination-normal'
import { getServerList, getServerDoing, getServerHistory } from '@/api/server'
import { getMissionDetail } from '@/api/mission'
import { cleanNull } from '@/utils/index'
// import { clearTimeout } from 'timers'
export default {
  mixins: [tablePaginationNormal],
  data () {
    return {
      addOrModifyVisible: false,
      mainTableHeight: 0,
      miniTableHeight: 0,
      isClick: false,
      isPremove: false,
      timer: null,
      form: {
        selectKeys: [
          {
            value: '',
            label: ''
          }, {
            value: 'serverMachineName',
            label: '设备'
          }, {
            value: 'serverIp',
            label: '设备地址'
          }
        ],
        statusKeys: [
          {
            value: '',
            label: ''
          }, {
            value: 0,
            label: '空闲'
          }, {
            value: 1,
            label: '占用'
          }
        ],
        isOnlineKeys: [
          {
            value: '',
            label: ''
          }, {
            value: 0,
            label: '不在线'
          }, {
            value: 1,
            label: '在线'
          }
        ],
        selectKeysValue: '',
        statusKeysValue: '',
        isOnlineValue: '',
        input: ''
      },
      serverList: {
        tableData: [],
        columns: [
          {
            field: 'serverMachineName',
            title: '设备'
          }, {
            field: 'serverIp',
            title: '设备地址'
          }, {
            field: 'status',
            title: '设备状态',
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
          }, {
            field: 'isOnline',
            title: '是否在线',
            isTag: true,
            formatter (val) {
              if (val === 0) {
                return {
                  value: '不在线',
                  type: 'warning'
                }
              } else if (val === 1) {
                return {
                  value: '在线',
                  type: ''
                }
              } else {
                return {
                  value: val,
                  type: 'info'
                }
              }
            }
          }, {
            title: '操作',
            group: [
              {
                title: '修改',
                type: 'button',
                clickHandler: this.addOrUpdateHandle
              }
            ]
          }
        ]
      },
      serverDoing: {
        tableData: [],
        columns: [
          {
            field: 'missionName',
            title: '任务名'
          }, {
            field: 'fileName',
            title: '详情',
            isShowTooltip: true
          }, {
            field: 'serverIp',
            title: '设备名'
          }, {
            field: 'executeStartTime',
            title: '开始时间'
          }, {
            field: 'executeEndTime',
            title: '结束时间'
          }
        ]
      },
      serverHistory: {
        tableData: [],
        columns: [
          {
            field: 'missionName',
            title: '任务名'
          }, {
            field: 'fileName',
            title: '详情',
            isShowTooltip: true
          }, {
            field: 'serverIp',
            title: '设备名'
          }, {
            field: 'executeStartTime',
            title: '开始时间'
          }, {
            field: 'executeEndTime',
            title: '结束时间'
          }
        ]
      }
    }
  },
  created () {
  },
  components: {
    addOrModify
  },
  beforeMount () {
    this.resize()
  },
  mounted () {
    this.getList()
    // this.getDetail()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  computed: {},
  methods: {
    cleanNull,
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      this.mainTableHeight = windowHeight - 217 - 51
      this.miniTableHeight = windowHeight - 392
    },
    addOrUpdateHandle (row) {
      this.addOrModifyVisible = true
      this.$nextTick(() => {
        Object.assign(this.$refs.addOrModify.dataForm, row)
        this.$refs.addOrModify.init()
      })
    },
    search () {
      this.getList()
    },
    getList () {
      let postData = {
        pageNo: this.page,
        pageSize: this.limit,
        status: this.form.statusKeysValue,
        isOnline: this.form.isOnlineValue
      }
      if (this.form.selectKeysValue) {
        postData[this.form.selectKeysValue] = this.form.input.trim()
      } else {
        this.form.input = ''
      }
      getServerList(postData).then(xhr => {
        this.serverList.tableData = xhr.data.data.records
        this.total = +xhr.data.data.total
        this.$refs.serverTable.setCurrentRow(this.serverList.tableData[0])
      })
    },
    getDoing () {
      return new Promise((resolve, reject) => {
        getServerDoing().then(xhr => {
          this.serverDoing.tableData = xhr.data
        }).finally(resolve)
      })
    },
    getHistory () {
      return new Promise((resolve, reject) => {
        getServerHistory().then(xhr => {
          this.serverHistory.tableData = xhr.data
        }).finally(resolve)
      })
    },
    getDetail (params) {
      return Promise.all([this.getDoing(), this.getHistory()])
    },
    rowClick (row, column, e) {
      this.isPremove = true
      getMissionDetail({
        serverIp: row.serverIp
      }).then(xhr => {
        if (this.timer) {
          window.clearTimeout(this.timer)
          this.isClick = false
        }
        this.serverDoing.tableData = []
        this.serverHistory.tableData = []
        xhr.data.data.records.forEach(item => {
          if (item.status === 2) {
            this.serverHistory.tableData.push(item)
          } else if (item.status === 1) {
            this.serverDoing.tableData.push(item)
          }
        })
        this.timer = setTimeout(() => {
          this.isClick = true
          this.isPremove = false
          this.timer = setTimeout(() => {
            this.isClick = false
            this.timer = null
          }, 1000)
        }, 100)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.moving{
  transition: all 1s;
  overflow: hidden;
}
.nowrap{
  white-space:nowrap;
}
.premove{
  position: absolute;
  overflow: hidden;
  top: 0;
  width: 10px;
  height: 10px;
  transform: scale(.1);
}
.el-form-item{
  margin-bottom: 10px;
}
.el-form{
  display: flex;
  justify-content: space-between;
}
.server-select, .server-input{
  // width: 80px;
}
</style>
