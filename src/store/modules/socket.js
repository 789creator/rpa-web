export default {
  namespaced: true,
  state: {
    socket: '',
    events: []
  },
  mutations: {
    'INIT_SOCKET' (state, socket) {
      state.socket = socket
      // 监听socket连接
      state.socket.onopen = () => {
        console.log('socket连接成功')
      }
      // 监听socket错误信息
      state.socket.onerror = () => {
        console.log('连接错误')
      }
      // 监听socket消息
      state.socket.onmessage = (msg) => {
        console.log(msg.data)
        state.events.forEach(foo => foo(msg.data))
      }
      state.socket.onclose = () => {
        console.log('socket关闭连接成功')
      }
    },
    'ADD_EVENT' (state, foo) {
      state.events.push(foo)
    },
    'REMOVE_EVENT' (state, foo) {
      const index = state.events.indexOf(foo)
      if (index !== -1) {
        state.events.splice(index, 1)
      } else {
        console.log('删除绑定的事件失败')
      }
    },
    'SEND' (state, params) {
      console.log(params, 333)
      state.socket.send(params)
    }
  },
  actions: {
    initSocket ({ commit }) {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        const path = window.SITE_CONFIG['apiURL'].replace(/http(s*):\/\//, '')
        // 实例化socket
        commit('INIT_SOCKET', new WebSocket('ws://' + path + '/ws/'))
      }
    },
    async send ({ commit }, params) {
      try {
        commit('SEND', params)
      } catch (error) {
        console.error('send', error.message)
      }
    }
  }
}
