export default {
  data () {
    return {
      tableHeight: 0
    }
  },
  beforeMount () {
    this.resize()
  },
  mounted () {
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      this.tableHeight = windowHeight - 247
    }
  }
}
