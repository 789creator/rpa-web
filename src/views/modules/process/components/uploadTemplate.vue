<template>
  <div class="mod-oss__oss">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="uploadHandle()">{{ $t('oss.upload') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="runScript()" :disabled="(!currentRow&&!multSelect)||(multSelect&&!dataListSelections.length)">执行</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="clearResult()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      ref="table"
      :highlight-current-row="!multSelect"
      :height="tableHeight"
      :data="dataList"
      border
      @current-change="handleCurrentChange"
      @select="selectHandler"
      @selection-change="dataListSelectionChangeHandle"
      @row-click="rowClick"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="文件名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('oss.createDate')"  header-align="center" align="center" width="180"></el-table-column>
      <el-table-column prop="size" label="大小" header-align="center" align="center" :formatter="fileSizeFormatter"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="clearResult(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[2, 10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <!-- 弹窗, 上传文件 -->
    <upload
      v-if="uploadVisible"
      ref="upload"
      :fileTypes="fileTypes"
      :fileTypesStr="fileTypesStr"
      @refreshDataList="refreshDataList"
    ></upload>
  </div>
</template>

<script>
import Upload from '@/views/modules/oss/oss-upload'
import { parseTime } from '@/utils'
export default {
  data () {
    return {
      runLoading: false,
      tableHeight: 0,
      dataList: [],
      dataListSelections: [], // 多选
      currentRow: null, // 单选
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataForm: {},
      uploadVisible: false
    }
  },
  props: {
    dataListStore: {
      type: String,
      required: true
    },
    dataListMutation: {
      type: String,
      required: true
    },
    delMutation: {
      type: String,
      required: true
    },
    multSelect: {
      type: Boolean,
      default: false
    },
    fileTypes: {
      type: Array
    },
    fileTypesStr: {
      type: String
    },
    runApi: Function
  },
  components: {
    Upload
  },
  beforeMount () {
    this.resize()
  },
  mounted () {
    this.getDataList()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      const dataListStore = this.$store.state.cache[this.dataListStore]
      this.total = dataListStore.length
      this.dataList = dataListStore.slice((this.page - 1) * this.limit, this.page * this.limit)
      this.dataListLoading = false
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 单选
    handleCurrentChange (val) {
      if (this.multSelect) { return }
      this.currentRow = val
    },
    selectHandler (selection, row) {
      if (!this.multSelect) {
        this.$refs.table.setCurrentRow(row)
      }
    },
    // 点击行触发选中
    rowClick (row, column, event) {
      if (this.multSelect) {
        this.$refs.table.toggleRowSelection(row)
      }
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getDataList()
    },
    // 四舍五入保留2位小数
    round (num) {
      return Math.round(100 * num) / 100
    },
    // 文件大小单位转化
    fileSizeFormatter (row, column, cellValue, index) {
      const zj = 1024
      const def = 1 / zj
      const kb = zj * zj
      const mb = kb * zj
      if (!row.size) {
        return '未知'
      } else if (row.size < zj) {
        return this.round(row.size) + '字节'
      } else if (row.size < kb) {
        return this.round(row.size * def) + 'KB'
      } else if (row.size < mb) {
        return this.round(row.size * def * def) + 'MB'
      } else {
        return this.round(row.size * def * def * def) + 'GB'
      }
    },
    // 自适应
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      this.tableHeight = windowHeight - 371
    },
    // 删除数据
    clearResult (id) {
      if (!id && !this.dataListSelections.length) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        if (!id) {
          this.dataListSelections.forEach(item => {
            this.$store.commit(`cache/${this.delMutation}`, item.id)
          })
        } else {
          this.$store.commit(`cache/${this.delMutation}`, id)
        }
        this.getDataList()
      }).catch(() => {})
    },
    // 上传后默认选中刚刚上传的
    refreshDataList (fileList) {
      let ids = []
      fileList.forEach(item => {
        const { name, uid, size } = item.raw
        const url = item.response.data.src
        this.$store.commit(`cache/${this.dataListMutation}`, {
          name,
          createDate: parseTime(uid),
          url,
          size,
          id: uid
        })
        ids.push(uid)
      })
      this.getDataList()
      this.$nextTick(() => {
        const rows = this.dataList.filter(item => ids.includes(item.id))
        rows.forEach(row => this.$refs.table[this.multSelect ? 'toggleRowSelection' : 'setCurrentRow'](row, true))
      })
    },
    // 执行脚本
    runScript () {
      const params = this.multSelect ? this.dataListSelections.map(item => ({
        name: item.name,
        url: item.url
      })) : [{
        name: this.currentRow.name,
        url: this.currentRow.url
      }]
      this.runLoading = true
      this.runApi({
        sourceFilePaths: JSON.stringify(params)
      }).then(xhr => {
        this.$message({
          type: 'success',
          message: xhr.data.data
        })
      }).finally(() => {
        this.runLoading = false
      })
    }
  }
}
</script>
