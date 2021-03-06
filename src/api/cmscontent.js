import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/cmscontent/listPageByTitle',
    method: 'get',
    params: query
  })
}

export function addContent(data) {
  return request({
    url: '/api/cmscontent/insert',
    method: 'post',
    data
  })
}

export function updateContent(data) {
  return request({
    url: `/api/cmscontent/update`,
    method: 'post',
    data
  })
}

export function deleteContent(id) {
  return request({
    url: `/api/cmscontent/delete/${id}`,
    method: 'post'
  })
}

export function getContent(id) {
  return request({
    url: `/api/cmscontent/get/${id}`,
    method: 'get'
  })
}
