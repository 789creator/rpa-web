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
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :height="tableHeight"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="templateName" :label="$t('mail.name')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="templateContent" show-overflow-tooltip label="内容" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.isDefault" type="text" size="small" @click="setDefault(scope.row.id)">设为默认</el-button>
            <el-button v-else type="text" size="small" disabled>默认发送模版</el-button>
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small"  @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import windowResize from '@/mixins/window-resize'
import AddOrUpdate from './sms-template-add-or-update'
import { getTemplateData, editTemplate, templateSetDefault } from '@/api/sms'
export default {
  mixins: [mixinViewModule, windowResize],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListApi: getTemplateData,
        getDataListIsPage: true,
        deleteApi: editTemplate,
        deleteIsBatch: true
      },
      dataForm: {
        input: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    setDefault (id) {
      templateSetDefault(id).then(xhr => {
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getDataList()
          }
        })
      })
    }
  }
}
</script>
