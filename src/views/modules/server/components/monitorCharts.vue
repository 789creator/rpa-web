<template>
  <el-row :gutter="10" type="flex" justify="space-around" align="top">
    <el-col class="text-center" v-for="(item, i) in list" :key="i">
      <p class="chart-title" :title="item.title">{{item.title}}</p>
      <simple-pie-chart width="100%" height="80px" :seriesData="item.seriesData"></simple-pie-chart>
      <p>{{item.describe}}</p>
    </el-col>
  </el-row>
</template>
<script>
import simplePieChart from '@/components/Charts/simplePieChart'
export default {
  components: {
    simplePieChart
  },
  props: {
    list: Array
  }
}
</script>

<style lang="scss" scoped>
.el-col{
  flex: 1;
  overflow: hidden;
}
.chart-title{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  word-break: break-all;
}
p{
  height: 16px;
}
</style>
