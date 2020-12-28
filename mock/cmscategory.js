const Mock = require('mockjs')

const data = {
  'totalCount': 15,
  'pageSize': 10,
  'totalPage': 1,
  'currPage': 0,
  'list': [
    {
      'id': 1,
      'createTime': '2020-12-08 01:05:59',
      'updateTime': '2020-12-08 01:05:59',
      'code': 'test',
      'name': '分类测试001',
      'description': '测试分类'
    },
    {
      'id': 2,
      'createTime': '2020-12-08 01:06:17',
      'updateTime': '2020-12-08 01:06:17',
      'code': 'test02',
      'name': '分类测试002',
      'description': '测试分类02'
    },
    {
      'id': 3,
      'createTime': '2020-12-14 13:37:16',
      'updateTime': '2020-12-14 13:37:16',
      'code': 'test03',
      'name': '分类测试003',
      'description': '测试分类03'
    },
    {
      'id': 4,
      'createTime': '2020-12-08 01:05:59',
      'updateTime': '2020-12-08 01:05:59',
      'code': 'test',
      'name': '分类测试001',
      'description': '测试分类'
    },
    {
      'id': 5,
      'createTime': '2020-12-08 01:06:17',
      'updateTime': '2020-12-08 01:06:17',
      'code': 'test02',
      'name': '分类测试002',
      'description': '测试分类02'
    },
    {
      'id': 6,
      'createTime': '2020-12-14 13:37:16',
      'updateTime': '2020-12-14 13:37:16',
      'code': 'test03',
      'name': '分类测试003',
      'description': '测试分类03'
    },
    {
      'id': 7,
      'createTime': '2020-12-08 01:05:59',
      'updateTime': '2020-12-08 01:05:59',
      'code': 'test',
      'name': '分类测试001',
      'description': '测试分类'
    },
    {
      'id': 8,
      'createTime': '2020-12-08 01:06:17',
      'updateTime': '2020-12-08 01:06:17',
      'code': 'test02',
      'name': '分类测试002',
      'description': '测试分类02'
    },
    {
      'id': 9,
      'createTime': '2020-12-14 13:37:16',
      'updateTime': '2020-12-14 13:37:16',
      'code': 'test03',
      'name': '分类测试003',
      'description': '测试分类03'
    },
    {
      'id': 10,
      'createTime': '2020-12-14 13:37:16',
      'updateTime': '2020-12-14 13:37:16',
      'code': 'test03',
      'name': '分类测试003',
      'description': '测试分类03'
    },
    {
      'id': 11,
      'createTime': '2020-12-08 01:05:59',
      'updateTime': '2020-12-08 01:05:59',
      'code': 'test',
      'name': '分类测试001',
      'description': '测试分类'
    },
    {
      'id': 12,
      'createTime': '2020-12-08 01:06:17',
      'updateTime': '2020-12-08 01:06:17',
      'code': 'test02',
      'name': '分类测试002',
      'description': '测试分类02'
    },
    {
      'id': 13,
      'createTime': '2020-12-14 13:37:16',
      'updateTime': '2020-12-14 13:37:16',
      'code': 'test03',
      'name': '分类测试003',
      'description': '测试分类03'
    },
    {
      'id': 14,
      'createTime': '2020-12-08 01:05:59',
      'updateTime': '2020-12-08 01:05:59',
      'code': 'test',
      'name': '分类测试001',
      'description': '测试分类'
    },
    {
      'id': 15,
      'createTime': '2020-12-08 01:06:17',
      'updateTime': '2020-12-08 01:06:17',
      'code': 'test02',
      'name': '分类测试002',
      'description': '测试分类02'
    }
  ]
}

module.exports = [

  // mock get all cates form server
  {
    url: '/api/cmscategory/list',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: data
      }
    }
  },

  // add cate
  {
    url: '/api/cmscategory/insert',
    type: 'post',
    response: {
      code: 200,
      data: {
        id: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update cate
  {
    url: '/api/cmscategory/update',
    type: 'post',
    response: {
      code: 200,
      data: {
        status: 'success'
      }
    }
  },

  // delete cate
  {
    url: '/api/cmscategory/delete/[A-Za-z0-9]',
    type: 'post',
    response: {
      code: 200,
      data: {
        status: 'success'
      }
    }
  },

  // get cate
  {
    url: '/api/cmscategory/get/[A-Za-z0-9]',
    type: 'get',
    response: {
      code: 200,
      data: data.list[0]
    }
  }
]
