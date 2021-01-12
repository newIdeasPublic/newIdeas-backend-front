import request from '@/utils/request'

// 分页查询用户信息
export function searchInfoUser(query) {
  return request({
    url: '/admin/sysuser/list',
    method: 'get',
    params: query
  })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/admin/sysuser/insert',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
// 更新用户
export function updateUser(data) {
  return request({
    url: `/admin/sysuser/update`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/admin/sysuser/delete/${id}`,
    method: 'post'
  })
}

// export function fetchList(query) {
//   return request({
//     url: '/api/cmscategory/list',
//     method: 'get',
//     params: query
//   })
// }

// export function addCate(data) {
//   return request({
//     url: '/api/cmscategory/insert',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     data
//   })
// }

// export function updateCate(data) {
//   return request({
//     url: `/api/cmscategory/update`,
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     data
//   })
// }

// export function deleteCate(id) {
//   return request({
//     url: `/api/cmscategory/delete/${id}`,
//     method: 'post'
//   })
// }

// export function get(id) {
//   return request({
//     url: `/api/cmscategory/get/${id}`,
//     method: 'get'
//   })
// }
