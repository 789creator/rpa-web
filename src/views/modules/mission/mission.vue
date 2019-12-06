<template>
  <div>
    <el-row class="mb20" :gutter="20">
      <el-col
        class="clearfix home-header-box"
        :span="8"
        v-for="(item, index) in headerItems"
        :key="index"
      >
        <el-card class="header-card">
          <div class="fl text-center header-box-svg mr10">
            <svg class="icon-svg" aria-hidden="true">
              <use :xlink:href="`#${item.svgId}`"></use>
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
    <div>
      <el-card>
        <el-form :inline="true" :modal="form" class="demo-form-inline">
          <el-form-item>
            <el-select class="mission-select" v-model="form.status" size="small" placeholder="请选择">
              <el-option
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select class="mission-select" v-model="form.selectKeysValue" size="small" placeholder="请选择">
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
              class="mission-input"
              v-model="form.input"
              size="small"
              placeholder="请输入内容"
              clearable
              @keyup.enter.native="search"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" size="small" @click="showAdvancedSearch">高级搜索</el-button>
            <el-tag
              closable
              disable-transitions
              v-for="tag in form.tags"
              :key="tag.name"
              @close="delTag"
            >{{tag.name}}</el-tag>
          </el-form-item>
        </el-form>
        <advanced-search ref="advancedSearch"></advanced-search>
        <el-table
          :height="tableHeight"
          :data="tableData"
          v-loading="loading"
          row-key="id"
          :load="getDetail"
          lazy
          style="width: 100%">
          <el-table-column v-for="(item,index) in columns" :key="index" :prop="item.field" :label="item.title" :show-overflow-tooltip="item.isShowTooltip">
            <template slot-scope="scope">
              <span v-if="item.field=='missionName'" style="color:#fff">
                {{cleanNull(scope.row.missionName, '-')}}
              </span>
              <div v-else-if="item.group">
                <div v-for="(innerItem, j) in item.group" :key="j">
                  <el-button v-if="innerItem.type=='button' && !(innerItem.show && !innerItem.show(scope.row))" type="text" size="small" @click.stop="innerItem.clickHandler(scope.row)">{{innerItem.title}}</el-button>
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
        <el-dialog
          :visible.sync="dialogVisible"
          width="90%">
          <detail ref="detail"></detail>
        </el-dialog>
      </el-card>
      <add-or-modify v-if="addOrModifyVisible" ref="addOrModify" @refreshDataList="()=>{getList();getWorkOrderNumbers()}"></add-or-modify>
      <!-- 弹窗, 发送邮件 -->
      <send v-if="sendVisible" ref="send" isNeedContent @send="sendMail" noEnter noEditMailTo></send>
    </div>
  </div>
</template>

<script>
import addOrModify from './addOrModify'
import advancedSearch from './advancedSearch'
import Send from '@/views/modules/message/mail-template-send'
import detail from './detail'
import tablePaginationNormal from '@/mixins/table-pagination-normal'
import { getMissionList, getWorkOrderStatus, getMissionDetail } from '@/api/mission'
import { getMailtemplate, getMail, sendMail } from '@/api/mail'
import { cleanNull } from '@/utils/index'
export default {
  mixins: [tablePaginationNormal],
  data () {
    return {
      addOrModifyVisible: false,
      tableHeight: 0,
      dialogVisible: false,
      loading: false,
      sendVisible: false,
      headerItems: [
        {
          title: '执行中',
          svgId: 'iconhuojian',
          status: 1,
          val: ''
        },
        {
          title: '待执行',
          svgId: 'iconclock',
          status: 0,
          val: ''
        },
        {
          title: '已完成',
          svgId: 'iconwodeduilie-',
          status: 2,
          val: ''
        }
      ],
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
          field: 'executeLink',
          title: '执行环节',
          formatter (val) {
            if (val === undefined) return '-'
            if (val === 1) {
              return '方案制作'
            } else if (val === 2) {
              return '现场方案审核'
            } else if (val === 3) {
              return '现场方案执行'
            } else if (val === 4) {
              return '效果评估审核'
            } else {
              return val
            }
          }
        }, {
          field: 'serverIp',
          title: '设备名'
        }, {
          field: 'executeStartTime',
          title: '开始时间'
        }, {
          field: 'executeEndTime',
          title: '结束时间'
        }, {
          field: 'status',
          title: '状态',
          isTag: true,
          formatter (val) {
            if (val === 0) {
              return {
                value: '待执行',
                type: 'warning'
              }
            } else if (val === 1) {
              return {
                value: '执行中',
                type: 'info'
              }
            } else if (val === 2) {
              return {
                value: '已完成',
                type: 'success'
              }
            } else if (val === 3) {
              return {
                value: '执行失败',
                type: 'danger'
              }
            } else {
              return {
                value: val
              }
            }
          }
        }, {
          title: '操作',
          group: [
            {
              title: '查看',
              type: 'button',
              clickHandler: this.showDetail,
              show (item) {
                return !item.hasChildren
              }
            }, {
              title: '发送邮件',
              type: 'button',
              clickHandler: this.sendEmail,
              show (item) {
                return item.hasChildren && (item.status === 2 || item.status === 3)
              }
            }, {
              title: '修改',
              type: 'button',
              clickHandler: this.addOrUpdateHandle
            }
          ]
        }
      ],
      form: {
        options: [
          {
            value: '',
            label: '全部'
          }, {
            value: 0,
            label: '待执行'
          }, {
            value: 1,
            label: '执行中'
          }, {
            value: 2,
            label: '已完成'
          }
        ],
        selectKeys: [
          {
            value: '',
            label: '(请选择)'
          }, {
            value: 'missionName',
            label: '任务名'
          }, {
            value: 'fileName',
            label: '详情'
          }, {
            value: 'serverIp',
            label: '设备名'
          }
        ],
        selectKeysValue: '',
        status: '',
        input: '',
        timeType: '',
        startTime: '',
        endTime: '',
        tags: []
      },
      postData: {
        status: '',
        timeType: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created () {
  },
  components: {
    addOrModify,
    detail,
    advancedSearch,
    Send
  },
  beforeMount () {
    this.resize()
  },
  mounted () {
    this.getWorkOrderNumbers()
    this.getList()
    window.addEventListener('resize', this.resize)
  },
  computed: {},
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    cleanNull,
    getDetail (tree, treeNode, resolve) {
      getMissionDetail({
        workId: tree.id,
        status: this.postData.status
      }).then(xhr => {
        resolve(xhr.data.data.records)
      })
    },
    sendEmail (row) {
      console.log(88)
      Promise.all([getMailtemplate({
        id: '1067246875800000076'
      }), getMail({
        workId: row.id
      })]).then(([xhr1, xhr2]) => {
        this.sendVisible = true
        this.$nextTick(() => {
          this.$refs.send.dataForm.mailTo = xhr2.data.data[0].mailAccount
          this.$refs.send.dataForm.id = xhr1.data.data.id
          this.$refs.send.dataForm.workId = row.id
          this.$refs.send.dataForm.content = this.templateReplace(xhr1.data.data.content, xhr2.data.data)
          this.$refs.send.init()
        })
      })
    },
    sendMail (params) {
      const _br = new RegExp('\\n', 'g')
      sendMail({
        templateId: params.id,
        mailTo: params.mailTo,
        workId: params.workId,
        content: params.content.replace(_br, '<br/>')
      }).then(xhr => {
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.$refs.send.visible = false
          }
        })
      })
    },
    templateReplace (str, data) {
      const aPos = str.indexOf('<#list data as template>')
      const bPos = str.indexOf('</#list>') + '</#list>'.length
      const minStr = str.substr(aPos, bPos - aPos)// 截取中间要循环的模版
      const template = minStr.replace('<#list data as template>', '').replace('</#list>', '') // 去掉模版开头结尾的两个指定字符
      const _br = new RegExp('<br/>', 'g')
      const [
        _successTotal,
        _failTotal,
        _executeLink
      ] = [
        'successTotal',
        'failTotal',
        'executeLink'
      ].map(s => {
        return new RegExp('\\${template.' + s + '}', 'g')
      })
      return str.replace(minStr, data.map(item => {
        return template.replace(_successTotal, item.successTotal).replace(_failTotal, item.failTotal).replace(_executeLink, item.executeLink)
      }).join('\n')).replace(_br, '\n')
    },
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      this.tableHeight = windowHeight - 361
    },
    addOrUpdateHandle (row) {
      this.addOrModifyVisible = true
      this.$nextTick(() => {
        Object.assign(this.$refs.addOrModify.dataForm, row)
        this.$refs.addOrModify.init()
      })
    },
    showDetail (row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.detail.getList(row.id)
        this.$refs.detail.getHeaderList(row.id)
      })
    },
    getList () {
      this.loading = true
      let data = {}
      if (this.form.selectKeysValue) {
        data[this.form.selectKeysValue] = this.form.input
      }
      getMissionList(Object.assign({
        pageNo: this.page,
        pageSize: this.limit,
        status: this.postData.status
      }, this.postData, data)).then(xhr => {
        this.tableData = xhr.data.data.records.map(item => ({
          ...item,
          hasChildren: true
        }))
        this.total = +xhr.data.data.total
      }).finally(xhr => {
        this.loading = false
      })
    },
    getWorkOrderNumbers () {
      /* 工单任务 0--未执行  1--执行中   2---执行完成 */
      getWorkOrderStatus().then(xhr => {
        xhr.data.data.forEach(item => {
          let headerItem = this.headerItems.find(headerItem => {
            return headerItem.status === item.status
          })
          if (headerItem) {
            headerItem.val = item.num
          }
        })
      })
    },
    search () {
      this.page = 1
      this.postData.status = this.form.status
      this.postData.timeType = this.form.timeType
      this.postData.startTime = this.form.startTime
      this.postData.endTime = this.form.endTime
      this.getList()
    },
    showAdvancedSearch () {
      this.$refs.advancedSearch.show().then(xhr => {
        Object.assign(this.form, xhr)
        this.$set(this.form, 'tags', xhr.tags)
        this.search()
      })
    },
    delTag (tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1)
      this.$refs.advancedSearch.form.dateRange = null
      this.form.timeType = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-svg {
  width: 30px;
  height: 50px;
  color: #fff;
}
.mission-select, .mission-input{
  width: 140px;
}
.el-tag{
  margin-left: 10px;
}
</style>
