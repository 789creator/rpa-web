export default {
  data () {
    return {
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0 // 总条数
    }
  },
  methods: {
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getList()
    }
  }
}
