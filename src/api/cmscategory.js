import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/cmscategory/list',
    method: 'get',
    params: query
  })
}

export function addCate(data) {
  return request({
    url: '/api/cmscategory/insert',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function updateCate(data) {
  return request({
    url: `/api/cmscategory/update`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function deleteCate(id) {
  return request({
    url: `/api/cmscategory/delete/${id}`,
    method: 'post'
  })
}

export function getCate(id) {
  return request({
    url: `/api/cmscategory/get/${id}`,
    method: 'get'
  })
}

export function isShow(data) {
  return request({
    url: `/api/cmscategory/isShow`,
    method: 'post',
    data
  })
}

export function fetchChild(parentId) {
  return request({
    url: `/api/cmscategory/getByParentId/${parentId}`,
    method: 'get'
  })
}

