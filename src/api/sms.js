import http from '@/utils/request'
export const getTemplateData = params => {
  return http.request({
    url: 'device/sms/template/page',
    isMock: true,
    params
  })
}
export const editTemplate = (method, params) => {
  return http.request({
    url: 'device/sms/template',
    method,
    isMock: true,
    ...params
  })
}
export const getTemplateById = id => {
  return http.request({
    url: `device/sms/template/${id}`,
    isMock: true,
    params: {}
  })
}
export const templateSetDefault = id => {
  return http.request({
    url: `device/sms/template/setDefault/${id}`,
    isMock: true,
    params: {}
  })
}
