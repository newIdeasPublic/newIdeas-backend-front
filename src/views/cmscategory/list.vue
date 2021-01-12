<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddCate">
      {{ $t('cmscategory.addCategory') }}
    </el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" :expand-row-keys="expandKeys" :default-sort="{prop: 'orderNo', order: 'ascending'}" :row-style="rowStyle" row-key="id" lazy border :load="loadChild" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
          <!-- <template v-if="scope.row.parentId === 0">
            <el-button icon="el-icon-caret-right" size="mini" circle @click="handleExpend(scope.row, $event)" />
          </template>
          <template v-else>
            <el-button icon="el-icon-caret-bottom" size="mini" circle @click="handleExpend(scope.row, $event)" />
          </template> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目编码" width="150">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="序号" sortable prop="orderNo">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="显示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isShow"
            active-color="#13ce66"
            inactive-color="#E3E3E3"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('cmscategory.edit') }}
          </el-button>
          <!-- <router-link :to="{name: 'cmscontentlist', params: { code: scope.row.code, name: scope.row.name, id:scope.row.id }}">
            <el-button type="primary" size="small" @click="handleContent(scope)">
              管理内容
            </el-button>
          </router-link> -->
          <template v-if="scope.row.parentId === 0">
            <el-button type="primary" @click="handleAddCate(scope.row)">
              {{ $t('cmscategory.addCategory') }}
            </el-button>
          </template>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('cmscategory.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增栏目'">
      <el-form :model="cate" label-width="80px" label-position="left">
        <el-form-item label="上级栏目">
          <el-input v-model="cate.parentName" placeholder="无" :disabled="true" />
        </el-form-item>
        <el-form-item label="栏目编码">
          <el-input v-model="cate.code" placeholder="栏目编码" />
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-input v-model="cate.name" placeholder="栏目名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="cate.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="cate.orderNo" placeholder="序号" />
        </el-form-item>
        <el-form-item label="显示">
          <el-switch
            v-model="cate.isShow"
            active-color="#13ce66"
            inactive-color="#E3E3E3"
            :active-value="1"
            :inactive-value="0"
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
import { addCate, deleteCate, updateCate, isShow, fetchChild } from '@/api/cmscategory'
import i18n from '@/lang'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const defaultCate = {
  code: '',
  name: '',
  imgUrl: '',
  isShow: 1,
  orderNo: 0,
  remark: ''
}

export default {
  // components: { Pagination },
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
      list: [],
      expandKeys: [],
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
      fetchChild(0).then(response => {
        // console.log(response.data.length)
        this.list = response.data
        /* for (var i = 0; i < this.list.length; i++) {
          this.list[i].hasChildren = true
        } */
        this.total = response.data.length

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    async loadChild(tree, treeNode, resolve) {
      // console.log(tree)
      // console.log(treeNode)
      this.listLoading = true
      fetchChild(tree.id).then(response => {
        // console.log(response.data.length)
        const list = this.getCloneOrderChild(response.data)
        tree.children = list
        treeNode.children = list
        resolve(list)
        // console.log(this.expandKeys)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    rowStyle({ row }) {
      // // console.log(row)
      if (row.hasChildren) {
        return { 'background-color': '#F6F6F6' }
      }
      return {}
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
    async changeStatus(val, row) {
      await isShow({
        'id': row.id,
        'isShow': val
      })
    },
    async handleExpend(row, event) {
      this.listLoading = true
      fetchChild(row.id).then(response => {
        // // console.log(event)
        row.parentId = -1
        if (response.data.length === 0) {
          return
        }
        var idx = 0
        for (var i = 0; i < this.list.length; i++) {
          idx++
          if (this.list[i].id === row.id) {
            break
          }
        }
        response.data.unshift(idx, 0)
        Array.prototype.splice.apply(this.list, response.data)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleAddCate(row) {
      this.cate = Object.assign({}, defaultCate)
      if (row) {
        this.cate.parentId = row.id
        this.cate.parentName = row.name
      } else {
        this.cate.parentId = undefined
        this.cate.parentName = ''
      }
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
        if (this.cate.routes) {
          const routes = this.generateRoutes(this.routes)
          this.$refs.tree.setCheckedNodes(this.generateArr(routes))
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        }
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
          // console.log($index, row)
          await deleteCate(row.id)
          if (row.parentId && row.parentId > 0) {
            for (let index = 0; index < this.list.length; index++) {
              if (this.list[index].id === row.parentId) {
                if (!this.list[index].children) {
                  return
                }
                const cld = this.list[index].children
                for (let idx = 0; idx < cld.length; idx++) {
                  if (cld[idx].id === row.id) {
                    cld.splice(idx, 1)
                    break
                  }
                }
                break
              }
            }
          } else {
            this.list.splice($index, 1)
          }

          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.total -= 1
        })
        .catch(err => { console.error(err) })
    },
    getCloneOrderChild(data) {
      // console.log(data)
      const list = JSON.parse(JSON.stringify(data))
      list.sort(function(a, b) {
        return a.orderNo - b.orderNo
      })
      // console.log(list)
      return list
    },
    updateChild(cld) {
      const list = this.getCloneOrderChild(cld)
      for (let idx = cld.length - 1; idx >= 0; idx--) {
        cld.splice(idx, 1)
      }
      for (let idx = 0; idx < list.length; idx++) {
        cld.push(list[idx])
      }
    },
    async confirmCate() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateCate(this.cate)

        if (this.cate.parentId && this.cate.parentId > 0) {
          for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].id === this.cate.parentId) {
              if (!this.list[index].children) {
                return
              }
              const cld = this.list[index].children
              for (let idx = 0; idx < cld.length; idx++) {
                if (cld[idx].id === this.cate.id) {
                  cld.splice(idx, 1, Object.assign({}, this.cate))
                  break
                }
              }
              this.updateChild(this.list[index].children)
              // this.list[index].children = []
              // this.list[index].children = this.getCloneOrderChild(cld)
              break
            }
          }
        } else {
          for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].id === this.cate.id) {
              const cld = this.list[index].children
              this.list.splice(index, 1, Object.assign({}, this.cate))
              this.list[index].children = cld
              break
            }
          }
        }
      } else {
        const { data } = await addCate(this.cate)
        // // console.log(data)
        this.cate = data
        if (this.cate.parentId && this.cate.parentId > 0) {
          for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].id === this.cate.parentId) {
              if (!this.list[index].children) {
                this.list[index].children = []
              }
              this.list[index].hasChildren = true
              this.list[index].children.push(this.cate)
              // this.expandKeys = []
              if (!this.expandKeys[this.cate.parentId + '']) {
                this.expandKeys.push(this.cate.parentId + '')
              }

              this.updateChild(this.list[index].children)
              // this.list[index].children = []
              // this.list[index].children = this.getCloneOrderChild(this.list[index].children)
              // console.log(this.expandKeys)
              break
            }
          }
        } else {
          this.cate.id = data.id
          this.list.push(this.cate)
          this.total += 1
        }
      }
      // this.$forceUpdate() // 强制刷新（重新渲染）此代码无效

      const { remark, code, name } = this.cate
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>栏目编码: ${code}</div>
            <div>栏目名称: ${name}</div>
            <div>备注: ${remark}</div>
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
