<template>
  <aside :class="['aui-sidebar', `aui-sidebar--${$store.state.sidebarLayoutSkin}`]">
    <div class="aui-sidebar__inner">
      <el-menu
        :default-active="$store.state.sidebarMenuActiveName"
        :collapse="$store.state.sidebarFold"
        :unique-opened="true"
        :collapseTransition="false"
        class="aui-sidebar__menu">
        <a-sub-menu v-for="menu in $store.state.sidebarMenuList" :key="menu.id" :menu="menu" />
      </el-menu>
    </div>
    <p>深圳市证通 版权所有</p>
  </aside>
</template>

<script>
import ASubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    ASubMenu
  },
  created () {
    this.$store.state.sidebarMenuList = window.SITE_CONFIG['menuList']
  }
}
</script>
<style lang="scss" scoped>
  .el-menu{
    letter-spacing: 6px;
  }
  p{
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 12px;
    text-align: center;
    width: 100%;
    z-index: 2;
    color: #fff;
    background: #589eff;
    margin: 0;
    padding: 12px 0;
  }
</style>
