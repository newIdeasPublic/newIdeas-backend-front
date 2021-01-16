<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" /> -->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">
          {{ $t('cmscontent.publish') }}
        </el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm(0)">
          {{ $t('cmscontent.draft') }}
        </el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
            {{ $t('cmscontent.title') }}
          </MDinput>
        </el-form-item>

        <el-form-item label-width="80px" label="所属栏目:" class="postInfo-container-item">
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
        </el-form-item>

        <el-form-item :label="$t('cmscontent.publishTime')+':'" class="postInfo-container-item">
          <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
        </el-form-item>

        <!-- <el-form-item label-width="60px" label="Importance:" class="postInfo-container-item">
          <el-rate
            v-model="postForm.importance"
            :max="3"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :low-threshold="1"
            :high-threshold="3"
            style="display:inline-block"
          />
        </el-form-item> -->

        <el-form-item style="margin-bottom: 40px;" :label="$t('cmscontent.summary')+':'">
          <el-input v-model="postForm.shortContent" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item prop="imgUrl" style="margin-bottom: 30px;">
          <Upload v-model="postForm.imgUrl" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
// import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import { getCate, fetchChild } from '@/api/cmscategory'
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { addContent, updateContent, getContent } from '@/api/cmscontent'

const defaultForm = {
  status: 0, // 状态：0草稿，1已发布，2已撤销
  title: '文章题目', // 文章题目
  content: '文章内容', // 文章内容
  shortContent: '文章摘要', // 文章摘要
  source_uri: '', // 文章外链
  imgUrl: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0,
  categoryId: 0
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky }, // , CommentDropdown, PlatformDropdown, SourceUrlDropdown
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
        title: [{ validator: validateRequire }],
        shortContent: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.shortContent.length
    },
    lang() {
      return this.$store.getters.language
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    this.getRemoteCateList(0)
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
      getContent(id).then(response => {
        console.log(response.data)
        this.postForm = response.data

        getCate(this.postForm.categoryId).then(response => {
          console.log('getCate', this.postForm.categoryId, response, response.data)
          if (response.data) {
            this.cateInfo = response.data
            if (this.cateInfo.parentId === 0) {
              this.categoryId1 = this.cateInfo.id
            } else {
              this.categoryId1 = this.cateInfo.parentId
              this.getRemoteCateList(this.categoryId1)
              this.categoryId2 = this.postForm.categoryId
            }
          }
        }).catch(err => {
          console.log(err)
        })

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    async submitForm(flag) {
      let notifyTitle = '保存'
      if (flag === 1) {
        notifyTitle = '发布'
      }
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
        const { data } = await updateContent(this.postForm)
        console.log('data====', data)
        this.postForm = data
        this.$notify({
          title: notifyTitle + '成功',
          message: notifyTitle + '内容成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.postForm.status = 1
        const { data } = await addContent(this.postForm)
        console.log('data====', data)
        this.postForm = data
        this.$notify({
          title: notifyTitle + '成功',
          message: notifyTitle + '内容成功',
          type: 'success',
          duration: 2000
        })
      }
      // this.postForm.status = 'published'
      this.loading = false
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
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
    },
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
        this.postForm.categoryId = val
        this.getRemoteCateList(val)
      } else {
        console.log(this.categoryId2)
        this.postForm.categoryId = this.categoryId2
      }
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
