<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="index(menu)" :title="menu[name]" :popper-append-to-body="false">
    <template slot="title">
      <span>{{ menu[name] }}</span>
    </template>
    <sub-menu v-for="item in menu.children" :key="item.id" :menu="item" :name="name" :index="menu=>index(menu)"></sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="index(menu)" :title="menu[name]">
    <span>{{ menu[name] }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './sub-menu'
export default {
  name: 'sub-menu',
  data () {
    return {
    }
  },
  props: {
    menu: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      default: 'name'
    },
    index: {
      type: Function,
      default: menu => menu.id
    }
  },
  mounted () {
  },
  components: {
    SubMenu
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
