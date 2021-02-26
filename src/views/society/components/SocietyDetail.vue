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
        <el-form-item label-width="180px" label="组织名称:" class="postInfo-container-item" :required="true" prop="orgName">
          <el-input v-model="postForm.orgName" placeholder="必填" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织分类:" class="postInfo-container-item">
          <el-select v-model="postForm.category" placeholder="请选择">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="180px" label="组织所在城市:" class="postInfo-container-item">
          <el-select v-model="postForm.city" placeholder="请选择" @change="cityOptionsChange($event, 1)">
            <el-option
              v-for="item in cityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="180px" label="组织所在社区:" class="postInfo-container-item">
          <el-select v-model="postForm.community" placeholder="请选择">
            <el-option
              v-for="item in communityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="180px" label="法人:" class="postInfo-container-item">
          <el-input v-model="postForm.juridicalPerson" placeholder="法人" />
        </el-form-item>
        <el-form-item label-width="180px" label="法人介绍:" class="postInfo-container-item">
          <el-input v-model="postForm.juridicalPersonIntroduction" placeholder="法人介绍" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系人姓名:" class="postInfo-container-item" :required="true" prop="linkman">
          <el-input v-model="postForm.linkman" placeholder="必填" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系人介绍:" class="postInfo-container-item">
          <el-input v-model="postForm.linkmanIntroduction" placeholder="联系人介绍" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系人电话:" class="postInfo-container-item" :required="true" prop="linkmanMobile">
          <el-input v-model="postForm.linkmanMobile" placeholder="必填" />
        </el-form-item>
        <el-form-item label-width="180px" label="联系电话:" class="postInfo-container-item">
          <el-input v-model="postForm.mobile" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织地址:" class="postInfo-container-item">
          <el-input v-model="postForm.orgAddress" placeholder="组织地址" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织资质证书:" class="postInfo-container-item" :required="true" prop="orgCertificationUrl">
          <el-input v-model="postForm.orgCertificationUrl" placeholder="必填" />
          <el-upload
            class="avatar-uploader"
            :action="certAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="postForm.orgCertificationUrl" :src="postForm.orgCertificationUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label-width="180px" label="组织介绍:" class="postInfo-container-item">
          <el-input v-model="postForm.orgIntroduction" placeholder="组织介绍" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织Logo:" class="postInfo-container-item">
          <el-input v-model="postForm.orgLogoUrl" placeholder="组织Logo" />
        </el-form-item>
        <el-form-item label-width="180px" label="组织邮箱:" class="postInfo-container-item">
          <el-input v-model="postForm.orgMail" placeholder="组织邮箱" />
        </el-form-item>
        <el-form-item label-width="180px" label="备注:" class="postInfo-container-item">
          <el-input v-model="postForm.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item label-width="180px" label="状态:" class="postInfo-container-item">
          <el-select v-model="postForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
  categoryId: '', // 组织分类编号
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
  status: 0, // 审核状态：0=待审核，1=已审核，2=审核未通过
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
      certAction: process.env.VUE_APP_BASE_API + '/api/common/upload',
      loading: false,
      userListOptions: [],
      cateOptions1: [],
      cateOptions2: [],
      categoryId1: null,
      categoryId2: null,
      cateInfo: null,
      rules: {
        // imgUrl: [{ validator: validateRequire }],
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        linkmanMobile: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }, { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }],
        orgCertificationUrl: [{ required: true, message: '请上传组织资质证书', trigger: 'blur', type: 'url' }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      statusOptions: [ // 审核状态：0=待审核，1=已审核，2=审核未通过
        {
          value: 0,
          label: '待审核'
        }, {
          value: 1,
          label: '已审核'
        }, {
          value: 2,
          label: '审核未通过'
        }
      ],
      categoryOptions: [
        {
          value: '教育助学',
          label: '教育助学'
        },

        {
          value: '环保探究',
          label: '环保探究'
        },

        {
          value: '动物救助',
          label: '动物救助'
        },

        {
          value: '三农发展',
          label: '三农发展'
        },

        {
          value: '扶乡村贫',
          label: '扶乡村贫'
        },

        {
          value: '社区发展',
          label: '社区发展'
        },

        {
          value: '救灾救援',
          label: '救灾救援'
        },

        {
          value: '社区教育',
          label: '社区教育'
        },

        {
          value: '公共卫生',
          label: '公共卫生'
        },

        {
          value: '疾病预防',
          label: '疾病预防'
        },

        {
          value: '关爱老人',
          label: '关爱老人'
        },

        {
          value: '妇女儿童',
          label: '妇女儿童'
        },

        {
          value: '残障支持',
          label: '残障支持'
        },

        {
          value: '社会创新',
          label: '社会创新'
        },

        {
          value: '建设咨询',
          label: '建设咨询'
        },

        {
          value: '民族宗教',
          label: '民族宗教'
        },

        {
          value: '文化艺术',
          label: '文化艺术'
        },

        {
          value: '社工支持',
          label: '社工支持'
        },

        {
          value: '孵化培育',
          label: '孵化培育'
        },

        {
          value: '大病救助',
          label: '大病救助'
        },

        {
          value: '公共空间',
          label: '公共空间'
        },

        {
          value: '法律普及',
          label: '法律普及'
        },

        {
          value: '乡村振兴',
          label: '乡村振兴'
        },

        {
          value: '社工站点',
          label: '社工站点'
        }
      ],
      cityOptions: [
        {
          value: '银川市',
          label: '银川市'
        },

        {
          value: '吴忠市',
          label: '吴忠市'
        },

        {
          value: '石嘴山市',
          label: '石嘴山市'
        },

        {
          value: '固原市',
          label: '固原市'
        },

        {
          value: '中卫市',
          label: '中卫市'
        }
      ],
      communityOptions: [],
      communityOptionsList:
        {
          '银川市': [
            {
              value: '西夏区',
              label: '西夏区'
            },

            {
              value: '兴庆区',
              label: '兴庆区'
            },

            {
              value: '金凤区',
              label: '金凤区'
            },

            {
              value: '贺兰县',
              label: '贺兰县'
            },

            {
              value: '永宁县',
              label: '永宁县'
            },

            {
              value: '滨河新区',
              label: '滨河新区'
            }
          ],
          '吴忠市': [
            {
              value: '利通区',
              label: '利通区'
            },

            {
              value: '红寺堡区',
              label: '红寺堡区'
            },

            {
              value: '青铜峡市',
              label: '青铜峡市'
            },

            {
              value: '同心县',
              label: '同心县'
            },

            {
              value: '盐池县',
              label: '盐池县'
            }
          ],
          '石嘴山市': [
            {
              value: '大武口区',
              label: '大武口区'
            },

            {
              value: '惠农区',
              label: '惠农区'
            },

            {
              value: '平罗县',
              label: '平罗县'
            }
          ],
          '固原市': [
            {
              value: '原州区',
              label: '原州区'
            },

            {
              value: '西吉县',
              label: '西吉县'
            },

            {
              value: '隆德县',
              label: '隆德县'
            },

            {
              value: '泾源县',
              label: '泾源县'
            },

            {
              value: '彭阳县',
              label: '彭阳县'
            }
          ],
          '中卫市': [
            {
              value: '沙坡头区',
              label: '沙坡头区'
            },

            {
              value: '中宁县',
              label: '中宁县'
            },

            {
              value: '海原县',
              label: '海原县'
            }
          ]
        }
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
    handleAvatarSuccess(res, file) {
      // console.log('handleAvatarSuccess.res', res, file)
      // this.postForm.imageUrl = URL.createObjectURL(file.raw)
      this.postForm.orgCertificationUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
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
      let notifyTitle = '保存'
      let validateFlag = true
      console.log('this.postForm', this.postForm)
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true
          validateFlag = true
        } else {
          validateFlag = false
          console.log('error submit!!')
          return false
        }
      })

      if (!validateFlag) {
        return false
      }

      if (this.isEdit) {
        // this.postForm.status = 1
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
        // this.postForm.status = 1
        notifyTitle = '添加'
        const { data } = await addSociety(this.postForm)
        console.log('data', data)
        // this.postForm = data
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
    },
    cityOptionsChange(val, flag) {
      // console.log('cityOptionsChange', val, flag, this.communityOptionsList)
      this.postForm.community = ''
      this.communityOptions = this.communityOptionsList[val]

      /* if (flag === 1) {
        this.categoryId2 = null
        this.postForm.categoryId = val
        this.getRemoteCateList(val)
      } else {
        console.log(this.categoryId2)
        this.postForm.categoryId = this.categoryId2
      } */
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: auto;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: auto;
    height: 100px;
    display: block;
  }
</style>
