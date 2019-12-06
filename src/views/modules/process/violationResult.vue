<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-message__mail-template">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.input" placeholder="输入名称搜索" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :height="tableHeight"
        :data="dataList"
        highlight-current-row
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column prop="inputFiles" label="输入文件" header-align="center" align="center"></el-table-column>
        <el-table-column prop="outputFiles" label="输出文件" header-align="center" align="center"></el-table-column>
        <el-table-column prop="exeResult" label="执行结果" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creatorName" label="创建者" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import windowResize from '@/mixins/window-resize'
import { getViolationResult } from '@/api/process'
export default {
  mixins: [mixinViewModule, windowResize],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListApi: getViolationResult,
        getDataListIsPage: true
      },
      dataForm: {
        input: ''
      }
    }
  },
  components: {
  },
  methods: {
  }
}
</script>
