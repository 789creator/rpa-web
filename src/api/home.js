import http from '@/utils/request'
export const getAnalyse = params => {
  return http.request({
    // baseURL: './json/',
    noLink: true,
    url: 'task/workOrderExecute/analyse',
    method: 'post',
    data: { ...params }
  })
}
export const getAnalyseByWeek = params => {
  return http.request({
    // baseURL: './json/',
    noLink: true,
    method: 'post',
    url: 'task/workOrderExecute/analyseData',
    data: { ...params }
  })
}
