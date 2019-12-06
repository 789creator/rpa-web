<template>
  <div>
    <h1>违规超配下单核查机器人</h1>
    <upload-template
      dataListStore="violationCheckUploads"
      dataListMutation="ADD_VIOLATION_CHECK_UPLOADS"
      delMutation="DEL_VIOLATION_CHECK_UPLOADS"
      :fileTypes="[
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]"
      fileTypesStr="xls、xlsx"
      :runApi="runApi" />
  </div>
</template>

<script>
import uploadTemplate from './uploadTemplate'
import { overweightCheck } from '@/api/process'
export default {
  data () {
    return {
      runLoading: false,
      runApi: overweightCheck,
      form: {
        name: '',
        number: ''
      }
    }
  },
  components: {
    uploadTemplate
  },
  methods: {
    runScript (params) {
      overweightCheck({
        sourceFilePath: params
      })
    }
  }
}
</script>
