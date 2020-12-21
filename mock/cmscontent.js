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

  // mock get content by code form server
  {
    url: '/api/cmscontent/listPageByCode',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: data
      }
    }
  },

  // add content
  {
    url: '/api/cmscontent/insert',
    type: 'post',
    response: {
      code: 20000,
      data: {
        id: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update content
  {
    url: '/api/cmscontent/update',
    type: 'post',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete content
  {
    url: '/api/cmscontent/delete/[A-Za-z0-9]',
    type: 'post',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // get content
  {
    url: '/api/cmscontent/get/[A-Za-z0-9]',
    type: 'get',
    response: {
      code: 20000,
      data: data.list[0]
    }
  }
]
