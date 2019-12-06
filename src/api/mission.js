import http from '@/utils/request'
export const getMissionList = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'task/workOrderTask/list',
    method: 'post',
    data: { ...params }
  })
}
export const getMissionDetail = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'task/workOrderExecute/list',
    method: 'post',
    data: { ...params }
  })
}
export const getWorkOrderStatus = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'task/workOrderExecute/getWorkOrderStatus',
    params
  })
}
export const update = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'task/workOrderExecute/update',
    method: 'post',
    data: { ...params }
  })
}
export const getAnalysisWorkOrder = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'analysis/work/order/getAnalysisWorkOrder',
    method: 'get',
    params
  })
}
export const getDetailPage = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sikulix/log/detail/page',
    method: 'get',
    params
  })
}
