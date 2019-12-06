<template>
  <div ref="chart" :style="{height:height,width:width}"/>
</template>

<script>
import resize from './mixins/resize'
import common from './mixins/common'
import sum from 'lodash/sum'
export default {
  mixins: [resize, common],
  props: {
    seriesData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    option () {
      const total = sum(this.seriesData)
      let option = {
        color: ['#4895ff', '#151934', '#4dcd45', '#ff9801'],
        series: [
          {
            name: '',
            type: 'pie',
            silent: true,
            radius: ['90%', '100%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.seriesData.map((item, i) => {
              let ret = {
                value: item
              }
              if (i === 0) {
                ret.label = {
                  normal: {
                    show: true,
                    position: 'center',
                    formatter: p => {
                      return p.percent + '%'
                    }
                  }
                }
                if (item / total > 0.8) {
                  ret.itemStyle = {
                    color: '#ff9801'
                  }
                }
              } else {
                ret.itemStyle = {
                  color: '#151934'
                }
              }
              return ret
            })
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
