<template>
  <el-menu class="zt-scroller" ref="menu" @select="clickHandler">
    <el-menu-item v-for="(item, i) in menu" :key="i" :index="item.id">{{item.name}}</el-menu-item>
  </el-menu>
</template>

<script>
import { getMenu } from '@/api/script'
export default {
  data () {
    return {
      menu: []
    }
  },
  mounted () {
    getMenu().then(xhr => {
      this.menu = xhr.data.data.map(item => ({
        id: item.id,
        name: item.name
      }))
      /* 初始化选中第一个 */
      this.$nextTick(() => {
        this.$refs.menu.$el.querySelector('li').click()
      })
    })
  },
  methods: {
    clickHandler (index) {
      this.$emit('select', index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-menu{
    border-right: none;
  }
</style>
