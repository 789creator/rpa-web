<template>
  <div ref="chart" :style="{height:height,width:width}"/>
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
          top: 20,
          bottom: 0,
          left: 0,
          right: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
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
              color: '#bfc1ca'
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
        series: [{
          name: '任务量',
          data: this.seriesData,
          type: 'bar',
          barWidth: 14,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            barBorderRadius: [8, 8, 0, 0]
          },
          markLine: {
            symbol: 'none',
            silent: true,
            lineStyle: {
              color: '#4dcd45',
              type: 'solid'
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }, {
          name: '平均值',
          type: 'line'
        }]
      }
      return option
    }
  },
  methods: {
  }
}
</script>
