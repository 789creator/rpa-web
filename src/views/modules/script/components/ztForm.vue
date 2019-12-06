<template>
  <div>
    <el-form :model="form" label-width="100px" :disabled="!$hasPermission('sikulix:script:save')">
      <el-form-item v-for="(item, i) in formItems" :key="i" :label="item.groups? item.groups[0].title: item.title">
        <el-row v-if="item.groups">
          <el-col v-for="(innerItem, j) in item.groups" :key="j" :span="innerItem.span">
            <label class="el-form-item__label" v-if="j!=0">{{innerItem.title}}</label>
            <el-input v-model="form[innerItem.field]" :disabled="innerItem.disabled" size="medium" spellcheck="false" :style="{'width':j!=0?'calc(100% - 68px)':'calc(100% - 10px)'}"></el-input>
          </el-col>
        </el-row>
        <el-cascader
          v-else-if="item.type=='cascader'"
          size="medium"
          v-model="form[item.field]"
          :options="cascaderOptions"
          @change="item.changeHandler"
        ></el-cascader>
        <el-input v-else-if="item.type=='textarea'" size="medium" type="textarea" v-model="form[item.field]"></el-input>
        <el-input v-else v-model="form[item.field]" size="medium" spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item v-if="$hasPermission('sikulix:script:save')">
        <el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
        <el-button @click="onReset" size="medium">重置</el-button>
        <el-button size="medium" v-popover:popover>执行脚本</el-button>
      </el-form-item>
    </el-form>
    <el-popover ref="popover" placement="top-start" v-model="popoverVisible" trigger="click">
      <el-input v-model="form.runIp" size="mini" placeholder="请输入ip" @keyup.enter.native="runScript"></el-input>
      <div class="text-right mt10">
        <el-button size="mini" type="primary" @click="runScript">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { update, execute } from '@/api/script'
export default {
  props: {
    data: Object,
    cascaderOptions: Array
  },
  data () {
    return {
      popoverVisible: false,
      formItems: [
        {
          title: '脚本名称',
          field: 'scriptName'
        }, {
          title: '脚本类型',
          field: 'scriptLanguageType'
        }, {
          title: '所属分类',
          field: 'scriptTypeIds',
          type: 'cascader',
          changeHandler: (value) => {
            this.form.scriptTypeId = [...value].pop()
            console.log(value)
          }
        }, {
          title: '脚本路径',
          field: 'scriptPath'
        }, {
          title: '脚本说明',
          field: 'scriptDesc',
          type: 'textarea'
        }, {
          groups: [
            {
              title: '创建者',
              field: 'creator',
              disabled: true,
              span: 10
            }, {
              title: '创建时间',
              field: 'createDate',
              disabled: true,
              span: 14
            }
          ]
        }, {
          groups: [
            {
              title: '最后更新者',
              field: 'updater',
              disabled: true,
              span: 10
            }, {
              title: '更新时间',
              field: 'updateDate',
              disabled: true,
              span: 14
            }
          ]
        }
      ],
      form: {
        runIp: ''
      }
    }
  },
  watch: {
    data: {
      handler (obj) {
        this.resetData(obj)
      },
      immediate: true
    }
  },
  methods: {
    onSubmit () {
      const keys = Object.keys(this.data)
      if (!keys.length) return
      let postData = {}
      keys.forEach(key => {
        postData[key] = this.form[key]
      })
      update(postData).then(xhr => {
        if (xhr.data.code === 0) {
          this.$emit('input', postData)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    onReset () {
      this.resetData(this.data)
    },
    resetData (obj) {
      for (let key in obj) {
        if (key === 'isTriggerNext') {
          this.$set(this.form, key, obj[key] === 1)
        } else {
          this.$set(this.form, key, obj[key])
        }
      }
    },
    runScript () {
      execute({
        toIp: this.form.runIp,
        scriptPath: this.form.scriptPath,
        scriptType: this.form.scriptLanguageType
      }).then(xhr => {
        this.$message({
          message: xhr.data.data,
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu{
    height: calc(100% - 20px);
    overflow: auto;
  }
  .el-form-item{
    &:last-child{
      margin-bottom: 0;
    }
  }
</style>
