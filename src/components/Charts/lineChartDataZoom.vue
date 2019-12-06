<template>
  <div ref="chart" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import common from './mixins/common'

export default {
  mixins: [resize, common],
  props: {
    xData: {
      type: Array,
      default () {
        return []
      }
    },
    seriesData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    option () {
      const textColor = '#6e6e75'
      let option = {
        color: ['#4895ff', '#4dcd45'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: 40,
          bottom: 40,
          left: 60,
          right: 60,
          containLabel: true
        },
        dataZoom: [
          {
            show: true
          },
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: textColor
          },
          axisLine: {
            color: '#494f66'
          },
          axisTick: {
            show: false
          },
          data: this.xData
        },
        yAxis: {
          type: 'value',
          splitNumber: 3,
          splitLine: {
            lineStyle: {
              color: '#191f39'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: textColor
          }
        },
        series: [
          {
            name: '任务量',
            data: this.seriesData,
            type: 'line'
          }
        ]
      }
      return option
    }
  },
  methods: {}
}
</script>
