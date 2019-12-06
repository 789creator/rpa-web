import http from '@/utils/request'
export const getServerList = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'serverList.json',
    noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sys/servers/list',
    method: 'post',
    data: { ...params }
  })
}
export const getServerDoing = params => {
  return http.request({
    baseURL: './json/',
    url: 'serverDoing.json',
    noLink: true,
    // url: 'user/info',
    params
  })
}
export const getServerHistory = params => {
  return http.request({
    baseURL: './json/',
    url: 'serverHistory.json',
    noLink: true,
    // url: 'user/info',
    params
  })
}
export const getServerFinish = params => {
  return http.request({
    baseURL: './json/',
    url: 'serverList.json',
    noLink: true,
    // url: 'user/info',
    params
  })
}
export const getServerStatus = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'serverList.json',
    noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sys/servers/getServerStatus',
    params
  })
}
export const update = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'serverList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sys/servers/update',
    method: 'post',
    data: { ...params }
  })
}
