<template>
  <div id='app'>
    <div id='college-detail'>

      <!-- 显示详细用户信息的对话框-->
      <Modal class='modal-user'
             v-model="isShowInforPanel"
             draggable
             scrollable
             title="用户信息">
        <div style='height:auto;margin-bottom:20px'>
          <div class='modal-detail'>
            <img :src="isShowInforPanel?require('@/assets/img/'+replyList.infor_portrait):require('@/assets/img/blank.png')">
            <a>{{ replyList.infor_name }}</a>
            <Button class='follow-button'
                    :type="isFollow?'warning':'primary'"
                    :style="{display:isLogin?'':'none'}"
                    @click='followUser(replyList.user_id)'>{{ checkFollow() }}</Button>
          </div>
          <div style='height:auto;width:100%;margin-bottom:40px'>
            <p>粉丝 xxx</p>
            <p>关注 xxx</p>
            <p>主题数 {{ replyList.infor_topic_num }}</p>
            <p>个性签名: {{ replyList.infor_autograph }}</p>
          </div>

        </div>
      </Modal>

      <!-- 页面头部，左边轮播图用来展示一些校园活动，右边是欢迎图片 -->
      <div class='head'>
        <!-- 校园信息 -->
        <img :src="checkImg(collegeInfor.college_portrait)?require('@/assets/img/'+collegeInfor.college_portrait):require('@/assets/img/blank.png')"
             class='college-img'>
        <a class='college-name'>{{ collegeInfor.college_name }}</a>
        <Button class='follow-button'
                :type="isFollowCollege?'warning':'primary'"
                :style="{display:isLogin?'':'none'}"
                @click='followCollege(collegeId)'>{{ checkFollowCollege() }}</Button>
        <Button class='signin-button'
                :style="{display:isLogin?'':'none'}"
                @click="signin">签到</Button>
      </div>

      <!-- 主题主界面左边 -->
      <div class='left'>
        <!-- 显示主题信息 -->
        <div class='topic-infor'>
          <!-- 主题信息，包括用户名头像发送时间 -->
          <div class='infor-left'>
            <img :src="checkImg(topicInfor.user_portrait)?require('@/assets/img/'+topicInfor.user_portrait):require('@/assets/img/blank.png')"
                 @click='showUserInfor(topicInfor.user_id,topicInfor.user_name)'
                 class='user-portrait'>
            <div class='infor-username'>
              <a>{{ topicInfor.user_name }}</a>
            </div>
          </div>
          <div class='infor-right'>
            <div class="infor-head"><a class='topic-title'>{{ topicInfor.topic_title }}</a></div>
            <div class="infor-head1"><a class='content-text'>{{ topicInfor.topic_content }}</a></div>
            <!-- 主题图片 -->
            <img :src="checkImg(topicInfor.topic_img)?require('@/assets/img/'+topicInfor.topic_img):require('@/assets/img/blank.png')"
                 class='topic-img'
                 :style="{display:checkImg(topicInfor.topic_img)?'':'none'}">
            <div class='infor-bottom'>
              <a class='detail-topicdate'>1楼</a>
              <a class='detail-topicdate'>{{ formartDate(topicInfor.topic_date) }}</a>
            </div>
          </div>
        </div>
        <Divider />
        <!-- 显示用户回复 -->
        <div class='topic-reply'
             v-for='(reply,index) in replyList'
             :key='index'>
          <!-- 主题信息，包括用户名头像发送时间 -->
          <div class='infor-left'>
            <img :src="checkImg(reply.user_portrait)?require('@/assets/img/'+reply.user_portrait):require('@/assets/img/blank.png')"
                 @click='showUserInfor(reply.user_id,reply.user_name)'
                 class='reply-portrait'>
            <div class='infor-username'>
              <a>{{ reply.user_name }}</a>
            </div>
          </div>
          <div class='infor-right'>
            <div class="infor-head2"><a class='content-text'>{{ reply.reply_content }}</a></div>
            <!-- 回复图片 -->
            <img :src="checkImg(reply.reply_image)?require('@/assets/img/'+reply.reply_image):require('@/assets/img/blank.png')"
                 class='topic-img'
                 :style="{display:checkImg(reply.reply_image)?'':'none'}">
            <div class='infor-bottom'>
              <a class='detail-topicdate'>{{ index+2 }}楼</a>
              <a class='detail-topicdate'>{{ formartDate(reply.reply_date) }}</a>
            </div>
          </div>
          <Divider />
        </div>
      </div>
      <!-- 主界面右边，显示自己关注的校园和一些常用小功能 -->
      <div class='right'>
        <!-- 显示常用功能 -->
        <commonly-menu />
      </div>

    </div>
  </div>
</template>

<script>
import CommonlyMenu from '../components/CommonlyMenu'
// 固定写法，参数的赋值
export default {
  name: 'topicDetail',
  inject: ['reload'],
  components: {
    'commonly-menu': CommonlyMenu
  },
  data () {
    return {
      isLogin: false,
      userId: '',
      userName: '',
      collegeId: '',
      topicId: '',
      replySelected: -1,
      quickReply: '',
      isShowInforPanel: false,
      isFollow: false,
      isFollowCollege: true,
      collegeInfor: [], // 校园信息
      topicInfor: [], // 主题信息
      replyList: [], // 回复列表
      extraReplyList: [] // 额外回复列表
    }
  },
  // 一些页面交互相关方法
  methods: {
    // 从Cookie获取登录状态
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
      this.topicId = sessionStorage['topicId']
      this.collegeId = sessionStorage['collegeId']
    },
    // 检查是否关注用户，修改按钮样式
    checkFollow () {
      if (this.isFollow) {
        return '取消关注'
      } else {
        return '关注'
      }
    },
    // 检查是否关注校园，修改按钮样式
    checkFollowCollege () {
      if (this.isFollowCollege) {
        return '取消关注'
      } else {
        return '关注'
      }
    },
    // 点击按钮后，关注或取消关注校园
    followCollege (userId) {
      if (!this.isFollowCollege) { // 关注
        this.$axios.post('/api/newUserFollow', {
          collegeId: this.collegeId,
          userId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.$Message.success('关注成功！')
            this.isFollowCollege = true
          } else {
            this.$Message.error('关注失败！')
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
        })
      } else { // 取消关注
        this.$axios.post('/api/deleteFollowById', {
          collegeId: this.collegeId,
          userId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.$Message.success('取消关注成功！')
            this.isFollowCollege = false
          } else {
            this.$Message.error('取消关注失败！')
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
        })
      }
    },
    signin () {
      this.$Message.success('签到完成！')
    },
    // 点击用户名后可查看详情并关注
    showUserInfor (userId, userName) {
      // 获取基本信息
      this.$axios.post('/api/findByCondition', {
        name: userName
      }).then(data => {
        this.userInfor = data.data
      })
      // 判断是否已经关注
      if (this.isLogin) {
        this.$axios.post('/api/findRelationById', {
          userId: userId,
          fansId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.isFollow = true
          } else {
            this.isFollow = false
          }
        })
      }
      // 显示对话框
      this.isShowInforPanel = true
    },
    /**
     * 通过时间戳返回yyyy-MM-dd HH:mm:ss
     * @param timestamp
     * @returns {string}
     */
    formartDate (param) {
      var time = new Date(param * 1000)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    },
    add0 (m) {
      return m < 10 ? '0' + m : m
    },
    // 检查图片是否存在
    checkImg (imgSrc) {
      if (imgSrc === null || imgSrc.length === 0) {
        return false
      } else {
        return true
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
    },
    // 获取校园信息
    getCollegeInfor () {
      this.$axios.post('/api/findCollegeById', {
        collegeId: this.collegeId
      }).then(data => {
        if (data.data !== null) {
          this.collegeInfor = data.data
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
      })
    },
    // 获取主题信息
    getTopicInfor () {
      this.$axios.post('/api/findTopicById', {
        topicId: this.topicId
      }).then(data => {
        if (data.data !== null) {
          this.topicInfor = data.data
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
      })
    },
    // 获取回复列表
    getReplyList () {
      this.$axios.post('/api/findReplyByTopicId', {
        topicId: this.topicId
      }).then(data => {
        if (data.data !== null) {
          this.replyList = data.data
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
      })
    },
    // 判断是否已经关注校园
    checkFollowC () {
      if (this.isLogin) {
        this.$axios.post('/api/findRelationById1', {
          collegeId: this.collegeId,
          userId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.isFollowCollege = true
          } else {
            this.isFollowCollege = false
          }
        })
      }
    },
    // 发送请求，更新所有页面信息
    syncPage () {
      this.getCollegeInfor()
      this.getTopicInfor()
      this.getReplyList()
      this.checkFollowC()
    }
  },
  // 生命周期函数，打开页面后自动运行
  created () {
    this.getLoginState()
    this.syncPage()
  }
}
</script>

<style scoped>
#app {
  position: relative;
  width: 100%;
  height: 4000px;
  background: #f8f8f9;
}
/* 校园详情 */
#college-detail {
  width: 68%;
  height: 100%;
  margin: 0 auto;
  margin-top: 10px;
}

.modal-user {
  height: auto;
  width: auto;
}

.modal-detail {
  height: 100px;
  width: 100%;
}
/* 用户头像 */
.modal-detail img {
  float: left;
  width: 80px;
  height: 80px;
}

.modal-detail a {
  float: left;
  height: auto;
  width: 80%;
  margin-left: 14px;
  text-decoration: none;
  color: #17233d;
  font-size: 20px;
}

.follow-button {
  position: relative;
  float: left;
  margin-left: 14px;
  margin-top: 20px;
}

.modal-user p {
  float: left;
  width: auto;
  height: auto;
  font-size: 16px;
  margin: 0 14px 10px 0;
}
/* 头部的大小定义 */
.head {
  position: relative;
  width: 100%;
  height: 100px;
  background-color: #ffffff;
}
/* 校园图片 */
.college-img {
  float: left;
  width: 60px;
  height: 60px;
  margin: 20px 0 0 20px;
}
/* 校园名称 */
.college-name {
  float: left;
  margin: 32px 0 0 20px;
  font-size: 22px;
  font-weight: bold;
  color: #17233d;
}
/* 校园关注按钮 */
.follow-button {
  float: left;
  font-size: 10px;
  margin: 32px 0 0 20px;
}
/* 签到按钮 */
.signin-button {
  float: right;
}
/* 左边界面 */
.left {
  position: relative;
  float: left;
  margin-top: 10px;
  margin-right: 1%;
  width: 68%;
  height: auto;
  min-height: 600px;
  padding-left: 20px;
  background: #ffffff;
}
/* 主题头部和用户回复整体区域样式 */
.topic_infor, .topic-reply{
  width: 100%;
  min-height: 100px;
  height: auto;
}

.topic_infor a,
.infor-right a,
.infor-head,
.infor-head1,
.infor-head2,
.infor-bottom a {
  text-decoration: none;
  text-align: left;
}

.infor-left {
  float: left;
  height: 100%;
  width: 15%;
}

.user-portrait {
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: solid #ffffff 1px;
  margin: 20px 0 0 0;
}

.infor-username {
  float: left;
  width: 100%;
  font-size: 16px;
  margin: 10px 0 0 -10px;
}

.infor-username a {
  text-decoration: none;
  text-align: center;
  color: #515a6e;
}

.infor-right {
  float: left;
  height: 100%;
  width: 85%;
}

.infor-head {
  width: 100%;
  height: auto;
  margin: 20px 0 0 0;
  padding-right: 20px;
}

.infor-head1 {
  width: 100%;
  height: auto;
  min-height: 80px;
  padding-right: 20px;
}

.topic-title {
  width: 100%;
  font-size: 24px;
  color: #17233d;
}

.content-text {
  width: 100%;
  font-size: 16px;
  color: #515a6e;
}

.topic-img {
  width: 400px;
  margin: 20px auto;
  height: auto;
}

.infor-bottom {
  float: right;
  width: 100%;
  text-align: right;
  margin: 0px 20px 20px 0;
}

.detail-topicdate {
  width: 40%;
  color: #515a6e;
}
/* 用户回复信息 */
.infor-head2 {
  width: 100%;
  height: auto;
  min-height: 120px;
  padding-right: 20px;
}
/* 回复用户的头像 */
.reply-portrait {
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: solid #ffffff 1px;
}
/* 右边界面 */
.right {
  position: relative;
  float: left;
  margin-top: 10px;
  width: 31%;
  height: auto;
  min-height: 100px;
  background-color: #ffffff;
}
</style>
