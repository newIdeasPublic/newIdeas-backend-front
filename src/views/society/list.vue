<template>
  <div class="app-container">
    <div class="createPost-container">
      <el-form ref="postForm" :model="postForm" class="form-container"><!--  :rules="rules" -->
        <el-row>
          <el-col :span="6">
            <el-form-item style="" prop="title">
              <el-input v-model="postForm.title" :maxlength="100" placeholder="标题" name="name" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="3">
            <el-form-item>
              <el-select v-model="categoryId1" placeholder="一级栏目" @change="cateOptionsChange($event, 1)">
                <el-option v-for="item in cateOptions1" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="categoryId2" :remote-method="getRemoteCateList" placeholder="二级栏目" @change="cateOptionsChange($event, 2)">
                <el-option v-for="item in cateOptions2" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-input v-model="postForm.author" placeholder="作者" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-date-picker
                v-model="displayTime"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                unlink-panels
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="2">
            <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">搜索</el-button>
          </el-col>
          <el-col :span="16" />
        </el-row>
      </el-form>
    </div>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织名称">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织分类">
        <template slot-scope="scope">
          {{ scope.row.category }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织所在城市">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织所在社区">
        <template slot-scope="scope">
          {{ scope.row.community }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="法人">
        <template slot-scope="scope">
          {{ scope.row.juridicalPerson }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="法人介绍">
        <template slot-scope="scope">
          {{ scope.row.juridicalPersonIntroduction }}
        </template>
      </el-table-column> -->
      <el-table-column align="header-center" label="联系人">
        <template slot-scope="scope">
          {{ scope.row.linkman }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="联系人介绍">
        <template slot-scope="scope">
          {{ scope.row.linkmanIntroduction }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="联系人电话">
        <template slot-scope="scope">
          {{ scope.row.linkmanMobile }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="联系电话">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="header-center" label="组织地址">
        <template slot-scope="scope">
          {{ scope.row.orgAddress }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织资质证书地址">
        <template slot-scope="scope">
          {{ scope.row.orgCertificationUrl }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织介绍">
        <template slot-scope="scope">
          {{ scope.row.orgIntroduction }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织Logo地址">
        <template slot-scope="scope">
          {{ scope.row.orgLogoUrl }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="组织邮箱">
        <template slot-scope="scope">
          {{ scope.row.orgMail }}
        </template>
      </el-table-column> -->

      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <router-link :to="'/society/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              {{ $t('cmscontent.edit') }}
            </el-button>
          </router-link>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('cmscontent.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增社会组织'">
      <el-form :model="cate" label-width="80px" label-position="left">
        <el-form-item label="社会组织标题">
          <el-input v-model="cate.title" placeholder="社会组织标题" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="cate.shortSociety" placeholder="简介" />
        </el-form-item>
        <el-form-item label="社会组织">
          <el-input
            v-model="cate.content"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="社会组织"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('cmscontent.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmSociety">
          {{ $t('cmscontent.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { fetchList, addSociety, deleteSociety, updateSociety } from '@/api/society'
import i18n from '@/lang'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchChild } from '@/api/cmscategory'

const defaultForm = {
  status: 0, // 状态：0草稿，1已发布，2已撤销
  title: '', // 文章题目
  display_time: undefined, // 前台展示时间
  importance: 0,
  categoryId: 0
}

const defaultSociety = {
  code: '',
  name: '',
  description: '',
  status: 0 // 状态：0草稿，1已发布，2已撤销
}

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      if (status !== undefined) {
        return statusMap[status]
      }
      return 'warning'
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log('rule', rule)
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      cate: Object.assign({}, defaultSociety),
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      cateOptions1: [],
      cateOptions2: [],
      categoryId1: null,
      categoryId2: null,
      cateInfo: null,
      rules: {
        // imgUrl: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }]
        // shortSociety: [{ validator: validateRequire }],
        // content: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      routes: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      categoryId: 0,
      pageQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listQuery: {
        category: '',
        city: '',
        community: '',
        juridicalPerson: '',
        linkman: '',
        orgAddress: '',
        orgName: ''
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      displayTime: ''
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and cates list from server
    // this.getRoutes()
    // this.getRemoteCateList(0)
    this.getList()
  },
  methods: {
    /*     async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    }, */
    getRemoteCateList(pid) {
      fetchChild(pid).then(response => {
        if (!response.data) return
        console.log('getRemoteCateList', response.data)
        if (pid === 0) {
          this.cateOptions1 = response.data
        } else {
          this.cateOptions2 = response.data
        }
      })
    },
    cateOptionsChange(val, flag) {
      console.log(val, flag, this.categoryId1, this.categoryId2)
      if (flag === 1) {
        this.categoryId2 = null
        this.getRemoteCateList(val)
      } else {
        console.log(this.categoryId2)
        this.postForm.categoryId = this.categoryId2
      }
    },
    statusText(status) {
      const statusMap = {
        0: '未审核',
        1: '已审核',
        2: '审核不通过'
      }
      if (status !== undefined) {
        return statusMap[status]
      }
      return '未知'
    },
    async getList() {
      this.listLoading = true
      fetchList(this.pageQuery, this.listQuery).then(response => {
        console.log('response.data', response.data)
        this.list = response.data.list
        this.total = response.data.totalCount

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    async submitForm(flag) {
      this.loading = true
      const query = Object.assign(this.listQuery, this.postForm)
      console.log('query', query)
      fetchList(query).then(response => {
        this.list = response.data.list
        this.total = response.data.totalCount

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
          this.loading = false
        }, 1.5 * 1000)
      }).catch(err => {
        console.error(err)
        this.listLoading = false
        this.loading = false
      })
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddSociety() {
      this.cate = Object.assign({}, defaultSociety)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.cate = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.cate.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('您确定要删除此社会组织吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteSociety(row.id)
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.total -= 1
          if (this.list.length < 8 && this.total > this.list.length) {
            this.getList()
          }
        })
        .catch(err => { console.error(err) })
    },
    async confirmSociety() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateSociety(this.cate)
        for (let index = 0; index < this.list.length; index++) {
          if (this.list[index].id === this.cate.id) {
            this.list.splice(index, 1, Object.assign({}, this.cate))
            break
          }
        }
      } else {
        this.cate.categoryId = this.categoryId
        console.log(this.cate)
        const { data } = await addSociety(this.cate)
        this.cate.id = data.id
        this.list.push(this.cate)
        this.total += 1
      }

      const { description, code, name } = this.cate
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Society Code: ${code}</div>
            <div>Society Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .cates-table {
    margin-top: 30px;
  }
  .cmscontent-tree {
    margin-bottom: 30px;
  }
}
</style>
