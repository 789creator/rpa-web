<template>
  <div ref="chart" :style="{height:height,width:width}"/>
</template>

<script>
import resize from './mixins/resize'
import common from './mixins/common'

export default {
  mixins: [resize, common],
  props: {
    seriesData: {
      type: Array,
      default () {
        return [[], [], []]
      }
    }
  },
  computed: {
    option () {
      let option = {
        color: ['#4895ff', '#151934', '#4dcd45', '#ff9801'],
        legend: {
          orient: 'vertical',
          itemWidth: 8,
          itemHeight: 8,
          x: 'right',
          y: 'center',
          align: 'left',
          itemGap: 30,
          formatter: name => {
            if (name === '执行效率(条/时)') {
              return name + '{w| ' + this.seriesData[0][0] + '}'
            } else if (name === '执行成功率(%)') {
              return name + '{w| ' + this.seriesData[1][0] + '}'
            } else if (name === '平均运行时长(分钟/条)') {
              return name + '{w| ' + this.seriesData[2][0] + '}'
            } else {
              return name
            }
          },
          data: [{
            name: '执行效率(条/时)',
            icon: 'circle'
          }, {
            name: '执行成功率(%)',
            icon: 'circle'
          }, {
            name: '平均运行时长(分钟/条)',
            icon: 'circle'
          }],
          textStyle: {
            color: '#777c90',
            rich: {
              w: {
                color: '#fff'
              }
            }
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            silent: true,
            radius: ['87%', '90%'],
            center: ['23%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{ value: this.seriesData[0][0], name: '执行效率(条/时)' }, { value: this.seriesData[0][1], name: '其他' }]
          },
          {
            name: '访问来源',
            type: 'pie',
            silent: true,
            radius: ['77%', '80%'],
            center: ['23%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.seriesData[1][0], name: '执行成功率(%)' },
              { value: this.seriesData[1][1], name: '其他' }
            ]
          },
          {
            name: '访问来源',
            type: 'pie',
            silent: true,
            radius: ['67%', '70%'],
            center: ['23%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.seriesData[2][0], name: '平均运行时长(分钟/条)' },
              { value: this.seriesData[2][1], name: '其他' }
            ]
          }
        ]
      }
      return option
    }
  },
  methods: {
  }
}
</script>
