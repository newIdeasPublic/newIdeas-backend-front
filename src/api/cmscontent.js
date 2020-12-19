import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/cmscontent/list',
    method: 'get',
    params: query
  })
}

export function addContent(data) {
  return request({
    url: '/vue-element-admin/cmscontent/add',
    method: 'post',
    data
  })
}

export function updateContent(id, data) {
  return request({
    url: `/vue-element-admin/cmscontent/${id}`,
    method: 'put',
    data
  })
}

export function deleteContent(id) {
  return request({
    url: `/vue-element-admin/cmscontent/${id}`,
    method: 'delete'
  })
}
