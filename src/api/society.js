import request from '@/utils/request'

export function fetchList(pageQuery, listQuery) {
  return request({
    url: '/society/org/list/page',
    method: 'post',
    params: pageQuery,
    data: listQuery
  })
}

export function addSociety(data) {
  return request({
    url: '/society/org/add',
    method: 'post',
    data
  })
}

export function updateSociety(data) {
  return request({
    url: `/society/org/update`,
    method: 'post',
    data
  })
}

export function deleteSociety(id) {
  return request({
    url: `/society/org/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}

export function getSociety(id) {
  return request({
    url: `/society/org/get/detail`,
    method: 'get',
    params: { 'id': id }
  })
}
