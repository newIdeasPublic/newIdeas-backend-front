import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/cate/list',
    method: 'get',
    params: query
  })
}

export function getList() {
  return request({
    url: '/vue-element-admin/cates',
    method: 'get'
  })
}

export function addCate(data) {
  return request({
    url: '/vue-element-admin/cate',
    method: 'post',
    data
  })
}

export function updateCate(id, data) {
  return request({
    url: `/vue-element-admin/cate/${id}`,
    method: 'put',
    data
  })
}

export function deleteCate(id) {
  return request({
    url: `/vue-element-admin/cate/${id}`,
    method: 'delete'
  })
}
