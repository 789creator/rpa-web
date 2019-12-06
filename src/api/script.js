import http from '@/utils/request'
export const getMenu = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'menu.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sikulix/type/list',
    params
  })
}
export const selectByTypeId = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'menu.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sikulix/script/selectByTypeId',
    method: 'get',
    params
  })
}
export const update = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'menu.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'agent/script/update',
    method: 'post',
    data: { ...params }
  })
}
export const getOptionsList = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'menu.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sikulix/script/list',
    method: 'get',
    params
  })
}
export const getScriptById = params => {
  return http.request({
    url: 'agent/script/getScriptById',
    method: 'get',
    params
  })
}
export const saveFile = params => {
  return http.request({
    url: 'agent/script/saveFile',
    method: 'post',
    data: { ...params }
  })
}
export const getTypeList = params => {
  return http.request({
    url: 'test/script/type/list',
    method: 'get',
    params
  })
}
export const getScriptByTypeId = params => {
  return http.request({
    url: 'agent/script/getScriptByTypeId',
    method: 'get',
    params
  })
}
export const execute = params => {
  return http.request({
    url: 'sikulix/script/execute',
    method: 'post',
    isMock: true,
    data: { ...params }
  })
}
