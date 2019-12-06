<template>
  <nav class="aui-navbar" :class="`aui-navbar--${$store.state.navbarLayoutType}`">
    <div class="aui-navbar__header">
      <h1 class="aui-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="aui-navbar__brand-lg" href="javascript:;">
          <!-- <div style="color: #3663fe">ZT</!-->
          <!-- <span style="letter-spacing: 2px;transform: scale(1.1,1);display: inline-block;">SZZT证通</span> -->
          <img src="~@/assets/img/logo-mini.png" width="50">
          <div class="logo-title">
            <div>中国移动</div>
            <div>流程自动化机器人</div>
          </div>
        </a>
        <a class="aui-navbar__brand-mini" href="javascript:;">
          <img src="~@/assets/img/logo-mini.png" width="40">
        </a>
      </h1>
    </div>
    <div class="aui-navbar__body">
      <el-menu v-if="false" class="aui-navbar__menu mr-auto" mode="horizontal">
        <!-- 隐藏侧边栏按钮 -->
        <el-menu-item index="1" @click="$store.state.sidebarFold = !$store.state.sidebarFold">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--switch" aria-hidden="true"><use xlink:href="#icon-outdent"></use></svg>
        </el-menu-item>
        <!-- 刷新按钮 -->
        <el-menu-item index="2" @click="refresh()">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--refresh" aria-hidden="true"><use xlink:href="#icon-sync"></use></svg>
        </el-menu-item>
      </el-menu>
      <div class="header-title">
        <h1>Hello {{$store.state.user.name}}</h1>
      </div>
      <div class="input-box dpib">
        <el-input size="medium" v-model="searchText" placeholder="请输入任务名"></el-input>
        <el-button class="no-border" icon="el-icon-search" size="mini" circle @click="xxx"></el-button>
      </div>
      <el-menu class="user-box" mode="horizontal">
        <el-menu-item index="4" class="aui-navbar__avatar">
          <el-dropdown placement="bottom" :show-timeout="0">
            <span class="el-dropdown-link">
              <img v-if="$store.state.user.gender==1" src="~@/assets/img/woman.png">
              <img v-else src="~@/assets/img/man.png">
              <span>{{ $store.state.user.name }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">{{ $t('updatePassword.title') }}</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">{{ $t('logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import { messages } from '@/i18n'
import screenfull from 'screenfull'
import UpdatePassword from './main-navbar-update-password'
import { clearLoginInfo } from '@/utils'
export default {
  inject: ['refresh'],
  data () {
    return {
      i18nMessages: messages,
      searchText: '',
      updatePassowrdVisible: false
    }
  },
  components: {
    UpdatePassword
  },
  methods: {
    // 全屏
    fullscreenHandle () {
      if (!screenfull.enabled) {
        return this.$message({
          message: this.$t('fullscreen.prompt'),
          type: 'warning',
          duration: 500
        })
      }
      screenfull.toggle()
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('logout') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.post('/logout').then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        }).catch(() => {})
      }).catch(() => {})
    },
    xxx () {
      console.log(this.$store.state.user.gender)
    }
  }
}
</script>
<style lang="scss" scoped>
  .aui-navbar__header{
    background: #589eff;
    h1{
      background: #589eff;
      padding: 75px 0;
      margin: 0;
      font-weight: normal;
    }
    .logo-title{
      display: inline-block;
      vertical-align: middle;
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      padding: 0 38px 0 12px;
      div:first-child{
        font-size: 16px;
        opacity: 1;
      }
      div:last-child{
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
  .svg-box{
    display: inline-block;
    width: 50px;
    height: 50px;
    background: #3663fe;
    border-radius: 30px;
  }
  .icon-svg{
    width: 30px;
    height: 50px;
  }
  .user-box{
    position: absolute;
    right: 15px;
    border-bottom: none;
    background: transparent;
    margin-top: -6px;
    .aui-navbar__avatar{
      &.is-active{
        border-bottom: none;
      }
      &:hover, &:focus{
        background-color: inherit;
      }
    }
  }
  .header-title{
    line-height: 54px;
  }
  .aui-navbar__body{
    padding: 0 15px;
    display: flex;
    align-items: center;
    h1{
      color: #3663fe;
      margin: 0;
      font-weight: normal;
    }
  }
  .input-box{
    width: 218px;
    height: 36px;
    position: absolute;
    right: 190px;
    background: #fff;
    box-shadow: 0 2px 10px 0 #9CC3FC;
    border-radius: 5px;
    // margin-top: 30px;
    .el-input{
      width: 170px;
    }
    .el-button{
      font-size: 18px;
      padding: 6px;
      position: absolute;
      top: 0;
      right: 5px;
      -webkit-transition: all .3s;
      height: 100%;
      text-align: center;
      &:hover, &:focus{
        color: inherit;
        border-color: inherit;
        background-color: inherit;
      }
    }
  }
</style>
