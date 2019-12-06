import Vue from 'vue'
import Element from 'element-ui'
import App from '@/Editor.vue'
import '@/element-ui/theme/index.css'
import '@/assets/scss/aui.scss'

Vue.use(Element, {
  size: 'default'
})

new Vue({
  render: h => h(App)
}).$mount('#app')
