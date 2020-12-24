<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddCate">
      {{ $t('cmscategory.addCategory') }}
    </el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="栏目ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目编码" width="220">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="说明">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('cmscategory.edit') }}
          </el-button>
          <router-link :to="{name: 'cmscontentlist', params: { code: scope.row.code, name: scope.row.name, id:scope.row.id }}">
            <el-button type="primary" size="small" @click="handleContent(scope)">
              管理内容
            </el-button>
          </router-link>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('cmscategory.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增栏目'">
      <el-form :model="cate" label-width="80px" label-position="left">
        <el-form-item label="栏目编码">
          <el-input v-model="cate.code" placeholder="栏目编码" />
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-input v-model="cate.name" placeholder="栏目名称" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="cate.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述说明"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('cmscategory.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmCate">
          {{ $t('cmscategory.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { fetchList, addCate, deleteCate, updateCate } from '@/api/cmscategory'
import i18n from '@/lang'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const defaultCate = {
  code: '',
  name: '',
  description: ''
}

export default {
  components: { Pagination },
  data() {
    return {
      cate: Object.assign({}, defaultCate),
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
      listQuery: {
        page: 1,
        size: 10,
        limit: 10
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false
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
    this.getList()
  },
  methods: {
    /*     async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    }, */
    async getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data.totalCount)
        this.list = response.data.list
        this.total = response.data.totalCount

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    handleAddCate() {
      this.cate = Object.assign({}, defaultCate)
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
    handleContent(scope) {
      this.$router.push({ name: 'cmscontentlist', params: { code: scope.row.code, name: scope.row.name, id: scope.row.id }})
    },
    handleDelete({ $index, row }) {
      this.$confirm('您确定要删除此分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteCate(row.id)
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.total -= 1
        })
        .catch(err => { console.error(err) })
    },
    async confirmCate() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateCate(this.cate)
        for (let index = 0; index < this.list.length; index++) {
          if (this.list[index].id === this.cate.id) {
            this.list.splice(index, 1, Object.assign({}, this.cate))
            break
          }
        }
      } else {
        const { data } = await addCate(this.cate)
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
            <div>Cate Code: ${code}</div>
            <div>Cate Name: ${name}</div>
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
  .cmscategory-tree {
    margin-bottom: 30px;
  }
}
</style>
