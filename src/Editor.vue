<template>
  <div class="editor-box">
    <div class="title">{{title}}</div>
    <div id="editor"></div>
    <div class="btn-panel">
      <el-button size="mini" type="text" @click="loadCode">刷新</el-button>
      <el-button size="mini" type="text" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { saveFile, getScriptById } from '@/api/script'
import { getURLParam } from '@/utils'
export default {
  data () {
    return {
      editor: null,
      id: null
    }
  },
  created () {
    this.id = getURLParam('id')
    this.title = getURLParam('fileName')
    document.title = `脚本编辑-${this.title}`
  },
  mounted () {
    this.init()
    this.initKeyEvent()
    this.loadCode()
  },
  methods: {
    init () {
      this.editor = window.ace.edit('editor')
      this.editor.session.setMode('ace/mode/python') // 设置语言
      this.editor.setTheme('ace/theme/eclipse') // 设置主题
      // enable autocompletion and snippets
      this.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true // 设置自动提示
      })
    },
    initKeyEvent () {
      document.getElementById('editor').addEventListener('keydown', e => {
        if (e.ctrlKey && e.keyCode === 83) { // ctrl + s
          e.preventDefault()
          this.save()
        } else if (e.keyCode === 116) { // F5
          e.preventDefault()
          this.loadCode()
        }
      })
    },
    loadCode () {
      getScriptById({
        scriptId: this.id
      }).then(xhr => {
        this.editor.setValue(xhr.data.data.scriptContent)
        this.editor.gotoLine(1)
      })
    },
    save () {
      saveFile({
        scriptId: this.id,
        scriptContent: this.editor.getValue()
      }).then(xhr => {
        this.$message({
          message: xhr.data.msg,
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .editor-box{
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100vh;
  }
  #editor {
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .title,
  .btn-panel {
    height: 30px;
    line-height: 30px;
    position: absolute;
  }

  .title {
    padding-left: 10px;
    top: 0;
    left: 0;
  }

  .btn-panel {
    top: 0;
    right: 20px;
  }
</style>
