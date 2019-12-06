<template>
  <div class="extract">
    <h1>评委抽取机器人</h1>
    <el-form :model="form" label-width="80px">
      <el-form-item label="项目编号">
        <el-input v-model="form.projectNo"></el-input>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="form.projectName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="runScript">执行</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { runExtractJudge } from '@/api/process'
export default {
  data () {
    return {
      form: {
        projectNo: '',
        projectName: ''
      }
    }
  },
  methods: {
    runScript () {
      const { projectNo, projectName } = this.form
      runExtractJudge({
        projectNo,
        projectName
      }).then(xhr => {
        console.log(xhr)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .extract{
    height: calc(100vh - 226px);
  }
</style>
