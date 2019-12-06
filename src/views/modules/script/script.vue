<template>
  <el-row class="full-height" :gutter="20">
    <el-col :span="6" class="full-height">
      <el-card >
        <zt-menu class="menu" ref="menu" @select="getMsg"></zt-menu>
      </el-card>
    </el-col>
    <el-col :span="18" class="full-height">
      <el-card>
        <el-tabs v-model="activeLink">
          <el-tab-pane v-for="(item, i) in formList" :key="i" :label="getTitleByLink(item.link)" :name="item.link">
            <zt-form class="content zt-scroller"
              :data="item"
              :nextScriptNameOptions="nextScriptNameOptions"
              @input="value => { resetFormItem(value, item) }"></zt-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import ztMenu from './components/ztMenu'
import ztForm from './components/ztForm'
import { selectByTypeId } from '@/api/script'
export default {
  components: {
    ztMenu,
    ztForm
  },
  data () {
    return {
      formList: [],
      activeLink: '1',
      nextScriptNameOptions: []
    }
  },
  beforeMount () {
    // getOptionsList().then(xhr => {
    //   this.nextScriptNameOptions = xhr.data.data.map(item => ({
    //     value: item.scriptTypeId,
    //     title: item.scriptName
    //   }))
    // })
  },
  methods: {
    getMsg (id) {
      selectByTypeId({ typeId: id }).then(xhr => {
        this.formList = xhr.data.data
        this.activeLink = this.formList[0].link
        this.nextScriptNameOptions = this.formList.map(item => ({
          value: item.scriptTypeId,
          title: item.scriptName
        }))
      })
    },
    getTitleByLink (link) {
      let titles = ['方案制作', '现场方案审核', '现场方案执行', '效果评估审核']
      return titles[link - 1]
    },
    resetFormItem (obj, oldObj) {
      Object.keys(obj).forEach(key => {
        oldObj[key] = obj[key]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu, .flex{
    overflow: auto;
  }
  .menu{
    height: calc(100vh - 153px);
  }
  .content{
    padding: 0 10px;
    height: calc(100vh - 207px);
    overflow: auto;
  }
  .flex{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
