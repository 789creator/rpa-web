import http from '@/utils/request'
export const getNav = params => {
  return http.request({
    // baseURL: './json/',
    // url: 'sys/menu/nav.json',
    // noLink: true,
    // baseURL: 'http://10.11.2.141:8080/robot-server',
    url: 'sys/menu/nav',
    isMock: true,
    params
  })
}
