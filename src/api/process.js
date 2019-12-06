import http from '@/utils/request'
export const getExtractResult = params => {
  return http.request({
    url: 'extract/judge/reply/result/page',
    isMock: true,
    params
  })
}
export const getViolationResult = params => {
  return http.request({
    url: 'record/exe/overweight/page',
    isMock: true,
    params
  })
}
export const overweightCheck = params => {
  return http.request({
    url: 'robot/overweight/check',
    isMock: true,
    method: 'post',
    data: { ...params }
  })
}
export const tenderCheck = params => {
  return http.request({
    url: 'robot/tender/check',
    isMock: true,
    method: 'post',
    data: { ...params }
  })
}
export const runExtractJudge = params => {
  return http.request({
    url: 'extract/judge/task/extractJudge',
    isMock: true,
    method: 'post',
    data: { ...params }
  })
}
