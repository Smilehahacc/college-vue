<template>
  <div id='app'>
    <!-- 显示发布主题对话框-->
    <Modal v-model="isShowInforPanel">
      <p slot="header"
         style="color:#2d8cf0;text-align:center;font-size: 18px">
        <Icon type="ios-create"></Icon>
        <span>发布主题</span>
      </p>
      <div style="text-align:center">
        <Input class='title-input'
               type="text"
               v-model='topicTitleText'
               :placeholder='topicTitleTips' />
        <!-- 主题内容输入区域 -->
        <div class="content-area">
          <Upload class='add-src-button'
                  :max-size='2048'
                  :show-upload-list="false"
                  action="//jsonplaceholder.typicode.com/posts/"
                  accept='image/*'
                  show-upload-list:false
                  :on-progress='uploadSuccess'>
            <Button icon="ios-cloud-upload-outline">添加图片</Button>
          </Upload>
          <Button size="small"
                  icon="md-trash"
                  type="error"
                  ghost
                  shape="circle"
                  @click="deleteSrc()"
                  style="float: left;margin: 4px 0 0 4px"></Button>
          <Select v-model="topicSort"
                  style="width:100px;float: right">
            <Option v-for="ts in topicSortList"
                    :value="ts.value"
                    :key="ts.value">{{ ts.label }}</Option>
          </Select>
          <span style="float: right;margin: 6px 10px 0 6px;font-size: 14px;">主题分类</span>

          <textarea class='content-input'
                    cols="1"
                    rows="4"
                    v-model='topicContentText'
                    :placeholder='topicContentTips' />
          <img :src="checkImg(topicImgName)?require('@/assets/img/'+topicImgName):require('@/assets/img/blank.png')"
               class='content-img'
               :style="{display:checkImg(topicImgName)?'':'none'}">
        </div>

      </div>
      <div slot="footer">
        <Button :loading="modal_loading"
                @click="closeModal()">取消</Button>
        <Button type="primary"
                :loading="modal_loading"
                @click="topicPublish()">发布</Button>

      </div>
    </Modal>

    <div class="float-menu"
         :style="{display:isLogin?'':'none'}">
      <!-- 右侧悬浮菜单 -->
      <ButtonGroup vertical>
        <Poptip trigger="hover"
                placement="right">
          <Button icon="ios-download"></Button>
          <div slot="content">
            <img :src='downloadApp'
                 class='download-img'
                 style="height:100px;width:100px">
          </div>
        </Poptip>
        <Poptip trigger="hover"
                word-wrap
                width="40"
                content="发布主题"
                placement="right">
          <Button icon="ios-create"
                  @click="openModal()"></Button>
        </Poptip>
      </ButtonGroup>
      <br><br>
      <ButtonGroup vertical>
        <Poptip trigger="hover"
                word-wrap
                width="40"
                content="刷新页面"
                placement="right">
          <Button icon="md-refresh"
                  @click="pageRefresh()"></Button>
        </Poptip>
        <Poptip trigger="hover"
                word-wrap
                width="40"
                content="分享"
                placement="right">
          <Button icon="ios-share-alt"
                  @click="collegeShare()"></Button>
        </Poptip>
        <Poptip trigger="hover"
                placement="right">
          <Button icon="md-heart"></Button>
          <div slot="content">
            <p>关注的校园</p>
            <div v-for='(forumName,index) in collegeUser'
                 :key='index'>
              <Button class='college-button'
                      type="dashed"
                      @click='collegeChoice(index,forumName.college_id)'>{{ forumName.college_name }}</Button>
            </div>
            <Button class='college-button'
                    type='primary'
                    ghost
                    @click='collegeMore()'>关注更多</Button>
            <div class="clearfloat"></div>
          </div>
        </Poptip>
        <Poptip trigger="hover"
                word-wrap
                width="40"
                content="用户反馈"
                placement="right">
          <Button icon="md-clipboard"
                  @click="userFeedback()"></Button>
        </Poptip>
      </ButtonGroup>
    </div>
  </div>
</template>

<script>
// 固定写法，参数的赋值
export default {
  name: 'floatMenu',
  inject: ['reload'],
  props: {
    // isLogin: {
    //   type: Array,
    //   require: true
    // }
  },
  data () {
    return {
      downloadApp: require('@/assets/img/downloadApp.png'),
      topicTitleText: '',
      topicContentText: '',
      topicTitleTips: '记得写下标题哦',
      topicContentTips: '在想什么呢～',
      topicImgName: '',
      isLogin: false,
      userId: '',
      userName: '',
      collegeId: '',
      topicSort: 0,
      isShowInforPanel: false,
      collegeUser: [],
      topicSortList: [
        {
          value: 1,
          label: '与你一起'
        },
        {
          value: 2,
          label: '乐享校园'
        },
        {
          value: 3,
          label: '校园帮帮'
        },
        {
          value: 4,
          label: '团团纳新'
        },
        {
          value: 5,
          label: '学习交流'
        },
        {
          value: 6,
          label: '你我易起'
        },
        {
          value: 7,
          label: '寻物启事'
        },
        {
          value: 8,
          label: '兼职招聘'
        }
      ]

    }
  },
  // 一些页面交互相关方法
  methods: {
    // 打开发布主题对话框
    openModal () {
      this.isShowInforPanel = true
    },
    // 关闭发布主题对话框
    closeModal () {
      this.isShowInforPanel = false
    },
    // 主题图片上传成功
    uploadSuccess (event, file, fileList) {
      this.topicImgName = file.name
    },
    // 删除上传的图片
    deleteSrc () {
      this.topicImgName = ''
    },
    // 发布主题
    topicPublish () {
      if (this.topicTitleText !== '' && this.topicContentText !== '' && this.topicSort !== 0) {
        var t = new Date().getTime()
        t = parseInt(t / 1000)
        this.$axios.post('/api/newTopic', {
          collegeId: this.collegeId,
          userId: this.userId,
          userName: this.userName,
          topicSort: this.topicSort,
          topicTitle: this.topicTitleText,
          topicContent: this.topicContentText,
          topicDate: t,
          topicImg: this.topicImgName
        }).then(response => {
          console.log('发布请求')
          if (response.data === 'SUCCESS') {
            this.$Message.success('主题发布成功')
            this.isShowInforPanel = false
            this.topicTitleText = ''
            this.topicContentText = ''
            this.topicSort = 0
          } else {
            this.$Message.error('抱歉，发布失败！')
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
        })
      } else if (this.topicTitleText === '') {
        this.$Message.warning('标题不能为空哦～')
      } else if (this.topicContentText === '') {
        this.$Message.warning('写下想要分享的吧')
      } else {
        this.$Message.warning('主题分类忘记选择啦')
      }
    },
    // 刷新页面
    pageRefresh () {
      this.$router.go(0)
    },
    // 校园分享
    collegeShare () {
      this.$Message.success('校园分享成功！')
    },
    // 用户反馈
    userFeedback () {
      this.$Message.success('跳转到用户反馈')
    },
    // 检查图片是否存在
    checkImg (imgSrc) {
      if (imgSrc === null || imgSrc.length === 0) {
        return false
      } else {
        return true
      }
    },
    // 点击校园后更新数据，刷新页面
    collegeChoice (index, collegeId) {
      this.$store.commit('setCollegeId', collegeId)
      this.$router.go(0)
    },
    // 点击关注更多校园
    collegeMore () {
      this.$Message.success('跳转到更多校园页面')
    },
    // 发送请求，更新用户相关页面信息
    syncUserPage () {
      // 请求关注的校园信息
      this.$axios.post('/api/findCollegeInforByUserId', {
        userId: this.userId
      }).then(data => {
        console.log('获取关注的校园')
        if (data.data !== null) {
          this.collegeUser = data.data
        }
      })
    },
    // 从Cookie获取登录状态
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
      this.collegeId = sessionStorage['collegeId']
      if (this.isLogin) {
        this.syncUserPage()
      }
    },
    // 获取cookie
    getCookie (cname) {
      var name = cname + '='
      var ca = document.cookie.split(';')
      console.log('正在获取cookie...')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        console.log(c)
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(name) !== -1) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  },
  // 生命周期函数，打开页面后自动运行
  created () {
    this.getLoginState()
  }
}
</script>

<style scoped>
#app {
  position: relative;
  width: 100%;
  height: auto;
  background: #ffffff;
}

.modal-publish {
  width: auto;
  height: auto;
}
/* 右侧悬浮菜单 */
.float-menu {
  position: fixed;
  float: right;
  width: 50px;
  height: auto;
  min-height: 200px;
  top: 200px;
  right: 180px;
  z-index: 99;
}
/* 主题内容输入区域 */
.content-area {
  margin-top: 20px;
  height: auto;
  min-height: 250px;
  width: 100%;
  border: #dcdee2 1px solid;
  padding-left: 10px;
}
/* 主题内容输入框 */
.content-input {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-bottom-width: 0px;
  border-right-width: 0px;
  font-size: 14px;
  color: #515a6e;
  outline: none;
  overflow: visible;
}
/* 添加主题图片按钮 */
.add-src-button {
  position: relative;
  float: left;
  margin: 0 0 10px -10px;
}
/* 主题图片显示 */
.content-img {
  float: left;
  height: 80px;
  width: auto;
  margin: 5px 0 10px 0;
}

/* 校园选择按钮 */
.college-button {
  width: 100%;
  height: 30px;
  margin: 4px auto;
}
</style>
