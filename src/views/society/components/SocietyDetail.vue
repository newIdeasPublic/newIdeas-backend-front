<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" /> -->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">
          提交
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label-width="180px" label="组织名称:" class="postInfo-container-item">
          <el-input v-model="postForm.orgName" placeholder="组织名称" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织分类:" class="postInfo-container-item">
          <el-input v-model="postForm.category" placeholder="组织分类" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织所在城市:" class="postInfo-container-item">
          <el-input v-model="postForm.city" placeholder="组织所在城市" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织所在社区:" class="postInfo-container-item">
          <el-input v-model="postForm.community" placeholder="组织所在社区" />
        </el-form-item>
        <el-form-item label-width="180px" label="法人:" class="postInfo-container-item">
          <el-input v-model="postForm.juridicalPerson" placeholder="法人" />
        </el-form-item>
        <el-form-item label-width="180px" label="法人介绍:" class="postInfo-container-item">
          <el-input v-model="postForm.juridicalPersonIntroduction" placeholder="法人介绍" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系人:" class="postInfo-container-item">
          <el-input v-model="postForm.linkman" placeholder="联系人" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系人介绍:" class="postInfo-container-item">
          <el-input v-model="postForm.linkmanIntroduction" placeholder="联系人介绍" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系人电话:" class="postInfo-container-item">
          <el-input v-model="postForm.linkmanMobile" placeholder="联系人电话" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系电话:" class="postInfo-container-item">
          <el-input v-model="postForm.mobile" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织地址:" class="postInfo-container-item">
          <el-input v-model="postForm.orgAddress" placeholder="组织地址" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织资质证书地址:" class="postInfo-container-item">
          <el-input v-model="postForm.orgCertificationUrl" placeholder="组织资质证书地址" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织介绍:" class="postInfo-container-item">
          <el-input v-model="postForm.orgIntroduction" placeholder="组织介绍" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织Logo地址:" class="postInfo-container-item">
          <el-input v-model="postForm.orgLogoUrl" placeholder="组织Logo地址" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织邮箱:" class="postInfo-container-item">
          <el-input v-model="postForm.orgMail" placeholder="组织邮箱" />
        </el-form-item>
        <el-form-item label-width="180px" label="备注:" class="postInfo-container-item">
          <el-input v-model="postForm.remark" placeholder="备注" />
        </el-form-item>

        <!-- <el-form-item label-width="80px" label="所属栏目:" class="postInfo-container-item">
          <el-select v-model="categoryId1" placeholder="一级栏目" @change="cateOptionsChange($event, 1)">
            <el-option v-for="item in cateOptions1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="categoryId2" :remote-method="getRemoteCateList" placeholder="二级栏目" @change="cateOptionsChange($event, 2)">
            <el-option v-for="item in cateOptions2" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label-width="80px" label="作者:" class="postInfo-container-item">
          <el-col :span="6">
            <el-input v-model="postForm.author" placeholder="原创作者" />
          </el-col>
        </el-form-item> -->

        <!-- <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item> -->

        <!-- <el-form-item prop="imgUrl" style="margin-bottom: 30px;">
          <Upload v-model="postForm.imgUrl" />
        </el-form-item> -->
      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/SingleImage3'
// import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
// import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { addSociety, updateSociety, getSociety } from '@/api/society'

const defaultForm = {
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  category: '', // 组织分类
  city: '', // 组织所在城市
  community: '', // 组织所在社区
  juridicalPerson: '', // 法人
  juridicalPersonIntroduction: '', // 法人介绍
  linkman: '', // 联系人
  linkmanIntroduction: '', // 联系人介绍
  linkmanMobile: '', // 联系人电话
  mobile: '', // 联系电话
  orgAddress: '', // 组织地址
  orgCertificationUrl: '', // 组织资质证书地址
  orgIntroduction: '', // 组织介绍
  orgLogoUrl: '', // 组织Logo地址
  orgMail: '', // 组织邮箱
  orgName: '', // 组织名称
  remark: '' // 备注
}

export default {
  name: 'SocietyDetail',
  components: { Sticky }, // , CommentDropdown, PlatformDropdown, Upload, SourceUrlDropdown, Tinymce,
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
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
    /* const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    } */
    return {
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
        orgName: [{ validator: validateRequire }],
        mobile: [{ validator: validateRequire }],
        orgMail: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      console.log('this.isEdit', this.isEdit)
      getSociety(id).then(response => {
        console.log(response.data)
        this.postForm = response.data

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑组织信息' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑组织信息'
      document.title = `${title} - ${this.postForm.id}`
    },
    async submitForm() {
      const notifyTitle = '保存'

      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
      if (this.isEdit) {
        this.postForm.status = 1
        const { data } = await updateSociety(this.postForm)
        console.log('data====', data)
        this.postForm = data
        this.$notify({
          title: notifyTitle + '成功',
          message: notifyTitle + '组织信息成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.postForm.status = 1
        const { data } = await addSociety(this.postForm)
        console.log('data====', data)
        this.postForm = data
        this.$notify({
          title: notifyTitle + '成功',
          message: notifyTitle + '组织成功',
          type: 'success',
          duration: 2000
        })
      }
      // this.postForm.status = 'published'
      this.loading = false
    },
    draftForm() {
      if (this.postForm.orgName.length === 0 || this.postForm.mobile.length === 0) {
        this.$message({
          message: '请填写必要的组织名称和联系电话',
          type: 'warning'
        })
        return
      }
      this.postForm.status = 0

      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
