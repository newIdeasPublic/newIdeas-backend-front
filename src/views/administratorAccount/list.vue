// 管理员账号列表
<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">
      {{ $t('administratorAccount.addUser') }}
    </el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="200">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="200">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('administratorAccount.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('administratorAccount.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增用户'">
      <el-form :model="userForm" :rules="rules"  ref="userForm" label-width="80px" label-position="left">
        <el-form-item label="用户名" class="notRequired">
          <el-input v-model="userForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱" class="notRequired">
          <el-input v-model="userForm.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" autocomplete="off" placeholder="请输入密码密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userForm.checkPass" autocomplete="off" placeholder="请再次输入密码密码"></el-input>
        </el-form-item>
        <el-form-item label="备注" class="notRequired">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="userForm.remark" placeholder="描述说明"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('cmscategory.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmUser">
          {{ $t('cmscategory.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { searchInfoUser,addUser,updateUser,deleteUser } from '@/api/administratorAccount'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const defaultCate = {
  username: '',
  mobile: '',
  email:'',
  password:'',
  checkPass:'',
  remark: ''
}
export default {
  components: { Pagination },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (!value.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
        callback(new Error('手机号码格式不正确'));
      } else {
        callback();
      }
    };
    return {
      listQuery: {
        page: 1,
        size: 10,
        limit: 10
      },
      rules: {
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true,validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true,validator: validatePass2, trigger: 'blur' }
        ]
      },
      total: 0,
      list: null,
      userForm: Object.assign({}, defaultCate),
      dialogVisible: false,
      listLoading: true,
      dialogType: 'new',
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      searchInfoUser(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.totalCount
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 新增用户
    handleAddUser() {
      this.userForm = Object.assign({}, defaultCate)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑用户
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      console.log(this.userForm,'this.cate333')
      scope.row.checkPass=scope.row.password;
      this.userForm = deepClone(scope.row)
      console.log(this.userForm,'this.cate555')
    },
    // 删除用户
    handleDelete({ $index, row }) {
      this.$confirm('您确定要删除此分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.id)
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.total -= 1
        })
        .catch(err => { console.error(err) })
    },
    // 新增/编辑用户 保存
    async confirmUser() {
      if (!this.userForm.mobile) {//未输入手机号时
        this.$message({
          message: "请输入手机号",
          showClose: false,
          type: "error"
        });
        return;
      }else if (!this.userForm.mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)){
        this.$message({
          message: "手机号码格式不正确",
          showClose: false,
          type: "error"
        });
        return;
      }
      if (!this.userForm.password) {//未输入密码时
        this.$message({
          message: "请输入密码",
          showClose: false,
          type: "error"
        });
        return;
      }
      if (!this.userForm.checkPass) {//未输入确认密码时
        this.$message({
          message: "请输入确认密码",
          showClose: false,
          type: "error"
        });
        return;
      }
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        if(this.userForm.password===this.userForm.checkPass && this.userForm.password!=""){
          console.log(this.userForm,'this.cate222')
          await updateUser(this.userForm)
          console.log(this.userForm,'this.cate111')
          for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].id === this.userForm.id) {
              this.list.splice(index, 1, Object.assign({}, this.userForm))
              break
            }
          }
        }else{
          this.$message.error('两次密码输入不一致，请重新输入');
          return
        }
      } else {
        if(this.userForm.password===this.userForm.checkPass && this.userForm.password!=""){
          const { data } = await addUser(this.userForm)
          console.log(this.userForm,'this.cate')
          this.getList();
          this.total += 1
        }else{
          this.$message.error('两次密码输入不一致，请重新输入');
          return
        }
      }
      const { username, mobile, email, password,remark} = this.userForm
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Cate Username: ${username}</div>
            <div>Cate Mobile: ${mobile}</div>
            <div>Email: ${email}</div>>
          `,
        type: 'success'
      })
    },
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
  .notRequired ::v-deep .el-form-item__label{
    box-sizing: border-box;
    padding-left:11px;
  }
}
</style>
