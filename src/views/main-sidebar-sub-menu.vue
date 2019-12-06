<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.id" :title="menu.name">
    <template slot="title">
      <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="`#${menu.icon}`"></use></svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu v-for="item in menu.children" :key="item.id" :menu="item"></sub-menu>
  </el-submenu>
  <el-menu-item :class="activeUrl=='/'+menu.url?'active':''" v-else :index="menu.id" :title="menu.name" @click="gotoRouteHandle(menu.id)">
    <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="`#${menu.icon}`"></use></svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
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
    }
  },
  mounted () {
  },
  components: {
    SubMenu
  },
  computed: {
    activeUrl () {
      return this.$route.path
    }
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menuId) {
      var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter(item => item.meta.menuId === menuId)[0]
      if (route) {
        this.$router.push({ name: route.name })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .icon-svg{
    width: 36px;
    height: 36px;
    margin: 0 24px 0 14px;
  }
</style>
