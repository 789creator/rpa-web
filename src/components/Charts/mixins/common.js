import echarts from 'echarts'
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    option: {
      deep: true,
      handler () {
        this.againCanvas()
      }
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs.chart)
      this.againCanvas()
    },
    // 重新画图
    againCanvas () {
      this.chart.setOption(this.option)
      this.chart.resize()
    }
  }
}
