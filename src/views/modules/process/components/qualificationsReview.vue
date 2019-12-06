<template>
  <div>
    <h1>投标文件资质评审机器人</h1>
    <upload-template
      dataListStore="qualificationsReviewUploads"
      dataListMutation="ADD_QUALIFICATIONS_REVIEW_UPLOADS"
      delMutation="DEL_QUALIFICATIONS_REVIEW_UPLOADS"
      multSelect
      :fileTypes="[
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]"
      fileTypesStr="doc、docx、xls、xlsx"
      :runApi="runApi" />
  </div>
</template>

<script>
import { tenderCheck } from '@/api/process'
import uploadTemplate from './uploadTemplate'
export default {
  data () {
    return {
      form: {
        name: '',
        number: ''
      },
      runApi: tenderCheck
    }
  },
  components: {
    uploadTemplate
  },
  methods: {
  }
}
</script>
