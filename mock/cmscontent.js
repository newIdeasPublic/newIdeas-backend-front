const Mock = require('mockjs')

const data = {
  'totalCount': 2,
  'pageSize': 10,
  'totalPage': 1,
  'currPage': 0,
  'list': [
    {
      'id': 1,
      'createTime': '2020-12-19 17:18:38',
      'updateTime': '2020-12-19 17:18:38',
      'categoryId': 1,
      'title': '111111',
      'shortContent': '',
      'content': '1111111',
      'imgUrl': '',
      'imgLink': '',
      'orderNo': 0,
      'status': 0
    },
    {
      'id': 2,
      'createTime': '2020-12-19 17:18:59',
      'updateTime': '2020-12-19 17:18:59',
      'categoryId': 1,
      'title': '1111112',
      'shortContent': '',
      'content': '11111112',
      'imgUrl': '',
      'imgLink': '',
      'orderNo': 0,
      'status': 0
    }
  ]
}

module.exports = [

  // mock get all cates form server
  {
    url: '/vue-element-admin/cmscontent/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: data.totalCount,
          items: data.list
        }
      }
    }
  },

  // add cate
  {
    url: '/vue-element-admin/cmscontent/add',
    type: 'post',
    response: {
      code: 20000,
      data: {
        id: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update cate
  {
    url: '/vue-element-admin/cmscontent/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete cate
  {
    url: '/vue-element-admin/cmscontent/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
