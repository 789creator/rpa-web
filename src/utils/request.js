import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'
import { Message } from 'element-ui'

const isLink = true
const isLinkAndMock = false
const MOCK_BASE_URL = 'http://localhost:7301/mock/5da3ea685e9c031cb403bea6/robot-server-gd/robot-server'
const http = axios.create({
  baseURL: window.SITE_CONFIG['apiURL'],
  timeout: 1000 * 180,
  withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers['token'] = Cookies.get('token') || ''
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  if (!isLink || config.noLink) {
    if (!config.isMock) {
      config.method = 'get'
      config.url += '.json'
      config.baseURL = './json'
    } else {
      config.baseURL = MOCK_BASE_URL
    }
  } else {
    if (isLinkAndMock && config.isMock) {
      config.baseURL = MOCK_BASE_URL
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.config.isMock && (isLinkAndMock || !isLink)) {
    response.data.code = 0
    return response
  }
  if (response.data.code === 401 || response.data.code === 10001) {
    clearLoginInfo()
    router.replace({ name: 'login' })
    return Promise.reject(response.data.msg)
  } else if (response.data.code && response.data.code !== 0) {
    let msg = response.data.msg || '系统异常'
    let code = response.data.code || '错误'
    let info = `【${code}】: ${msg}`
    Message.error(info)
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  let msg = error['response.data.message'] || '系统异常'
  let code = error['response.code'] || '错误'
  let info = `【${code}】: ${msg}`
  console.log(error.request)
  Message.error(info)
  return Promise.reject(error)
})

export default http
