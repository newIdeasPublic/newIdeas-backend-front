import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/cmscategory/list',
    method: 'get',
    params: query
  })
}

export function addCate(data) {
  return request({
    url: '/vue-element-admin/cmscategory/add',
    method: 'post',
    data
  })
}

export function updateCate(id, data) {
  return request({
    url: `/vue-element-admin/cmscategory/${id}`,
    method: 'put',
    data
  })
}

export function deleteCate(id) {
  return request({
    url: `/vue-element-admin/cmscategory/${id}`,
    method: 'delete'
  })
}
