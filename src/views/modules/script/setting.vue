<template>
  <div>
    <el-menu ref="headerMenu" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <sub-menu :menu="item" v-for="(item, i) in headerMenu" :key="i" name="scriptTypeName" :index="menu=>menu.id+','+menu.scriptTypeName"></sub-menu>
    </el-menu>
    <el-row class="mt10" :gutter="10">
      <el-col :span="6">
        <el-card class="card-body zt-scroller" :style="{height: cardHeight}">
          <el-menu>
            <el-menu-item v-for="(item,i) in scripts" :key="i" :index="String(i)" @click="clickScript(item)">{{item.scriptName}}</el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="card-body zt-scroller" :style="{height: cardHeight}">
          <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, i) in breadList" :key="i">{{item}}</el-breadcrumb-item>
          </el-breadcrumb> -->
          <zt-form
            class="content zt-scroller"
            :data="formList"
            :cascaderOptions="cascaderOptions"
            @input="saveForm"
          ></zt-form>
          <div>
            <el-button class="no-border" :icon="isShowEditor?'el-icon-arrow-up':'el-icon-arrow-down'" style="width:100%" @click="toggleCodeVisible">{{isShowEditor?'隐藏':'查看'}}脚本内容</el-button>
            <transition name="el-zoom-in-top">
              <div v-show="isShowEditor" class="editor-box">
                <div class="editor-box-btns">
                  <el-button class="no-border" icon="el-icon-refresh" circle @click="loadCode(activeScriptId)"></el-button>
                  <el-button class="no-border" icon="el-icon-edit" circle @click="editCode(activeScriptId)"></el-button>
                </div>
                <div class="zt-scroller" id="editor"></div>
                <!-- <el-button @click="saveCode">保存</el-button>
                <el-button @click="sendSocket">发送</el-button>
                <el-button @click="addSocketFoo">添加事件</el-button>
                <el-button @click="removeSocketFoo">删除事件</el-button>
                <el-button @click="editCode(activeScriptId)">编辑</el-button> -->
              </div>
            </transition>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ztMenu from './components/ztMenu'
import ztForm from './components/ztForm'
import SubMenu from '@/components/Common/sub-menu'
import { getScriptById, getTypeList, getScriptByTypeId } from '@/api/script'
import { mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      editor: null, // 编辑器
      isShowEditor: false, // 是否显示编辑器
      isRefresh: true, // 编辑器内容是否已更新
      activeScriptId: null, // 选中的脚本id
      cardHeight: 0,
      activeIndex: '',
      formList: {},
      headerMenu: [], // 顶部菜单列表
      headerObj: {},
      scripts: [] // 左侧脚本列表
      // breadList: []
    }
  },
  computed: {
    cascaderOptions () {
      return this.header2CascaderOpt(this.headerMenu)
    }
  },
  mounted () {
    this.initHeader()
    // eslint-disable-next-line
    this.editor = ace.edit('editor')
    this.editor.session.setMode('ace/mode/python') // 设置语言
    this.editor.setTheme('ace/theme/eclipse')// 设置主题
    // enable autocompletion and snippets
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      maxLines: 30,
      minLines: 2,
      enableLiveAutocompletion: true// 设置自动提示
    })
    this.editor.setReadOnly(true)
    window.addEventListener('resize', this.resize)
  // this.inputValue = editor.getValue() // 读值
  // editor.setValue(editorValue)
  /* eslint-enable no-alert, no-console */
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  components: {
    ztMenu,
    ztForm,
    SubMenu
  },
  methods: {
    ...mapActions('socket', ['send']),
    ...mapMutations('socket', {
      addSocketEvent: 'ADD_EVENT',
      removeSocketEvent: 'REMOVE_EVENT'
    }),
    loadCode (id) {
      if (!id) return
      this.editor.setValue('')
      getScriptById({
        scriptId: id
      }).then(xhr => {
        const code = xhr.data.data.scriptContent
        this.editor.setValue(code)
      }).catch(xhr => {
        console.log(xhr)
      })
    },
    toggleCodeVisible () {
      this.isShowEditor = !this.isShowEditor
      if (!this.isRefresh) {
        console.log(323)
        this.loadCode(this.activeScriptId)
        this.isRefresh = true
      }
    },
    header2CascaderOpt (arr) {
      if (arr && arr.length) {
        return arr.map(item => {
          this.headerObj[item.id] = item.scriptTypeName
          return {
            value: item.id,
            label: item.scriptTypeName,
            children: this.header2CascaderOpt(item.children)
          }
        })
      } else {
        return null
      }
    },
    addSocketFoo () {
      this.addSocketEvent(this.xxx)
    },
    initHeader () {
      getTypeList().then(xhr => {
        this.headerMenu = Object.freeze(xhr.data.data)
        this.$nextTick(() => {
          this.resize()
        })
      })
    },
    removeSocketFoo () {
      this.removeSocketEvent(this.xxx)
    },
    /* 选中头部菜单 */
    handleSelect (key, keyPath) {
      getScriptByTypeId({
        id: key.split(',')[0]
      }).then(xhr => {
        this.scripts = Object.freeze(xhr.data.data)
        // this.breadList = keyPath.map(item => item.split(',')[1])
        // this.breadList.isInit = false
      })
      console.log(key, keyPath)
    },
    /* 选中脚本 */
    clickScript (script) {
      // if (this.breadList.isInit) {
      //   this.breadList.pop()
      // }
      // this.breadList.isInit = true
      // this.breadList.push(script.scriptName)
      this.formList = script
      this.isRefresh = false
      this.isShowEditor = false
      this.activeScriptId = script.id
    },
    saveForm (value) {
      this.resetFormItem(value)
      const index = this.formList.scriptTypeId + ',' + this.headerObj[this.formList.scriptTypeId]
      this.$refs.headerMenu.updateActiveIndex(index)
      this.handleSelect(index)
    },
    resetFormItem (obj) {
      Object.assign(this.formList, obj)
    },
    editCode (id) {
      if (!id) return
      window.open(`./editor.html?fileName=${this.formList.scriptName}&id=${id}`, '_blank')
    },
    sendSocket () {
      console.log(111)
      this.send(123)
    },
    resize () {
      const windowHeight = Math.max(window.innerHeight, 600)
      const headerHeight = this.$refs.headerMenu.$el.clientHeight
      this.cardHeight = windowHeight - headerHeight - 123 + 'px'
      // console.log(windowHeight, headerHeight)
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu, .flex{
    overflow: auto;
  }
  .card-body{
    overflow: auto;
    // height: calc(100vh - 200px);
  }
  // .menu{
  //   height: calc(100vh - 153px);
  // }
  .content{
    padding: 0 10px;
    // height: calc(100vh - 207px);
    overflow: auto;
  }
  .flex{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #editor {
    width: 100%;
    // height: 400px;
    font-size: 14px;
  }
  .mt10{
    margin-top: 10px;
  }
  .el-menu{
    border-bottom: 0;
    border-right: 0;
  }
  .editor-box{
    position: relative;
    margin-top: 2px;
    &-btns{
      position: absolute;
      top: 0;
      right: 15px;
      opacity: 0.9;
      z-index: 1;
      .el-button{
        background: transparent;
      }
    }
  }
</style>
