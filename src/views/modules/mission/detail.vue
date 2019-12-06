<template>
  <div>
    <el-table :data="headerTable.tableData" :height="180" style="width: 100%">
      <el-table-column v-for="(item,index) in headerTable.columns" :key="index" :prop="item.field" :label="item.title" :show-overflow-tooltip="item.isShowTooltip">
        <template slot-scope="scope">
          <span v-if="index==0" style="color:#fff">
            {{cleanNull(scope.row[item.field], '-')}}
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
    <el-table :height="tableHeight" :data="tableData" style="width: 100%">
      <el-table-column v-for="(item,index) in columns" :key="index" :prop="item.field" :label="item.title" :show-overflow-tooltip="item.isShowTooltip">
        <template slot-scope="scope">
          <span v-if="index==0" style="color:#fff">
            {{cleanNull(scope.row[item.field], '-')}}
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
      :page-sizes="[2,10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </div>
</template>
<script>
import { getDetailPage, getAnalysisWorkOrder } from '@/api/mission'
import { cleanNull } from '@/utils/index'
export default {
  data () {
    return {
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      tableHeight: 200,
      headerTable: {
        tableData: [],
        columns: [
          {
            field: 'resultReason',
            title: '原因'
          }, {
            field: 'amount',
            title: '记录数'
          }
        ]
      },
      tableData: [],
      columns: [
        {
          field: 'workOrder',
          title: '工单编号'
        }, {
          field: 'amount',
          title: '工单记录'
        }, {
          field: 'result',
          title: '处理结果'
        }, {
          field: 'resultReason',
          title: '原因'
        }, {
          field: 'serverIp',
          title: '执行机器IP'
        }, {
          field: 'createDate',
          title: '创建时间'
        }
      ]
    }
  },
  props: {},
  methods: {
    cleanNull,
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getList()
    },
    getList (taskId) {
      getDetailPage({
        page: this.page,
        limit: this.limit,
        taskId
      }).then(xhr => {
        this.tableData = xhr.data.data.list
        this.total = +xhr.data.data.total
      })
    },
    getHeaderList (taskId) {
      getAnalysisWorkOrder({
        taskId
      }).then(xhr => {
        this.headerTable.tableData = xhr.data.data
      })
    }
  }
}
</script>
