import http from '@/utils/request'
export const getMonitorList = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'serverList.json',
    noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'agent/system/monitor/page',
    method: 'get',
    params
  })
}
export const getCpuData = params => {
  return http.request({
    url: 'agent/system/monitor/cpu',
    method: 'get',
    params
  })
}
export const getMemoryData = params => {
  return http.request({
    url: 'agent/system/monitor/memory',
    method: 'get',
    params
  })
}
