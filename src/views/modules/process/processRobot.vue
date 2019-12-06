<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="评委抽取" name="extractJudges">
        <extract-judges />
      </el-tab-pane>
      <el-tab-pane label="违规超配下单核查" name="violationCheck">
        <violation-check />
      </el-tab-pane>
      <el-tab-pane label="投标文件资质评审" name="qualificationsReview">
        <qualifications-review />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import extractJudges from './components/extractJudges'
import violationCheck from './components/violationCheck'
import qualificationsReview from './components/qualificationsReview'
export default {
  data () {
    return {
      activeName: 'extractJudges'
    }
  },
  components: {
    extractJudges,
    violationCheck,
    qualificationsReview
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
