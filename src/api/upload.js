import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/api/common/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
