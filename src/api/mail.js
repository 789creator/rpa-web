import http from '@/utils/request'
export const getMailtemplate = params => {
  console.log(params)
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: `sys/mailtemplate/${params.id}`
  })
}
export const getMail = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'task/workOrderTask/mail',
    method: 'post',
    data: { ...params }
  })
}
export const sendMail = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'missionList.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sys/mailtemplate/sendWithAttachment',
    method: 'post',
    data: { ...params }
  })
}
