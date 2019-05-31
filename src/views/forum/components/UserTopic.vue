<template>
  <div id='app'>
    <!-- 显示详细用户信息的对话框-->
    <Modal class='modal-user'
           v-model="isShowInforPanel"
           draggable
           scrollable
           title="用户信息">
      <div style='height:auto;margin-bottom:20px'>
        <div class='modal-detail'>
          <img :src="isShowInforPanel?require('@/assets/img/'+userInfor.infor_portrait):require('@/assets/img/blank.png')">
          <a>{{ userInfor.infor_name }}</a>
          <Button class='follow-button'
                  :type="isFollow?'warning':'primary'"
                  :style="{display:isLogin?'':'none'}"
                  @click='followUser(userInfor.user_id)'>{{ checkFollow() }}</Button>
        </div>
        <div style='height:auto;width:100%;margin-bottom:40px'>
          <p>粉丝 xxx</p>
          <p>关注 xxx</p>
          <p>主题数 {{ userInfor.infor_topic_num }}</p>
          <p>个性签名: {{ userInfor.infor_autograph }}</p>
        </div>

      </div>
    </Modal>

    <!-- 用户主题展示-->
    <div class='recommend-topic'
         v-for='(topic,index) in followTopic'
         :key='index'
         :style="{display:isShow?'':'none'}">
      <!-- 关注人的主题信息，包括用户名头像发送时间 -->
      <div class='follow-infor'>
        <img :src="require('@/assets/img/'+topic.user_portrait)"
             @click='showUserInfor(topic.user_id,topic.user_name)'>
        <!-- 名字和发送时间 -->
        <div class='follow-infor-detail'>
          <a class='detail-username'>{{ topic.user_name }}</a>
          <a class='detail-topicdate'>{{ formartDate(topic.topic_date) }}</a>
        </div>
      </div>
      <Poptip trigger="hover"
              :title='topic.college_name'
              :content='getTopicSort(topic.topic_sort)'
              placement="right-start">
        <p>{{ topic.topic_title }}</p>
      </Poptip>
      <div class='topic-content'
           @click='getTopicDetail(topic.topic_id)'>
        <!-- 主题图片 -->
        <img :src="checkImg(topic.topic_img)?require('@/assets/img/'+topic.topic_img):require('@/assets/img/blank.png')"
             class='topic-img'
             :style="{display:checkImg(topic.topic_img)?'':'none'}">
        <div class='content-text'>{{ topic.topic_content }}</div>
      </div>
      <!-- 关注人主题相关操作按钮，点赞回复分享收藏，显示在最后一排 -->
      <div class='topic-infor'>
        <div class='infor-detail'>
          <Icon type="md-heart"
                class='infor-icon1' />
          <a>{{ topic.topic_praise }}</a>
          <a @click='praiseClick(index,topic.topic_praise)'>点赞</a>
        </div>
        <div class='infor-detail'>
          <Icon type="ios-chatbubbles"
                class='infor-icon1' />
          <a @click='replyClick(index,topic.topic_id)'>回复</a>
        </div>
        <div class='infor-detail'>
          <Icon type="ios-share-alt"
                class='infor-icon1' />
          <a @click='shareClick(index,topic.topic_id)'>分享</a>
        </div>
        <div class='infor-detail'>
          <Icon type="md-star"
                class='infor-icon1' />
          <a @click='collectionClick(index,topic.topic_id)'>收藏</a>
        </div>
      </div>
      <!-- 快捷回复栏 -->
      <div class='quick-reply'
           :style="{display:(replySelected === index)?'':'none'}">
        <!-- 回复简略信息 -->
        <div class='reply-show'
              v-for='(reply,index) in replyList'
              :key='index'>
           <!-- 主题图片 -->
          <img :src="checkImg(reply.user_portrait)?require('@/assets/img/'+reply.user_portrait):require('@/assets/img/blank.png')"
              class='reply-user-portrait'>
          <div class='reply-detail'>
            <a class='reply-user'>{{ reply.user_name }}</a>
            <a class='reply-date'>{{ formartDate(reply.reply_date) }}</a>
          </div>
          <a class='reply-content'>{{ reply.reply_content }}</a>
        </div>
        <!-- 输入栏和发送回复按钮 -->
        <input v-model="quickReply"
               type="text"
               placeholder='写下你想说的吧～'>
        <Button class='reply-button'
                type="primary"
                @click='replyPublish(topic.topic_id)'>
          发表
        </Button>
      </div>
      <Divider />
    </div>

  </div>
</template>

<script>
// 固定写法，参数的赋值
export default {
  name: 'forumCenter',
  inject: ['reload'],
  props: {
    followTopic: {
      type: Array,
      require: true
    },
    topicType: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      isLogin: false,
      userId: '',
      userName: '',
      isShow: false,
      replySelected: -1,
      quickReply: '',
      isShowInforPanel: false,
      isFollow: false,
      userInfor: [], // 用户详细信息
      replyList: [] // 用户回复信息
      // followTopic: [{
      //   topic_id: '1',
      //   college_id: 0,
      //   college_name: '厦门理工学院',
      //   user_id: 1,
      //   user_name: 'lynn',
      //   user_portrait: 'portrait2.png',
      //   topic_sort: 1,
      //   topic_date: '1555320001',
      //   topic_title: '这里是测试主题标题',
      //   topic_content: '这里是测试主题内容这里是测题内容这里是测内容这里试测试主题内容这里是测试主题内容',
      //   topic_praise: 2,
      //   topic_img: 'portrait.png'
      // }],
      // replyList: [{
      //   reply_id: 1,
      //   topic_id: 1,
      //   user_id: 1,
      //   user_name: '测试小姐姐',
      //   user_portrait: 'portrait.png',
      //   reply_content: '这里是第一回复',
      //   reply_date: 1559205922,
      //   reply_praise: 2,
      //   reply_image: 'portrait.png'
      // }]
    }
  },
  // 一些页面交互相关方法
  methods: {
    // 从Cookie获取登录状态
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
      if (this.topicType === 'followTopic') {
        this.isShow = this.isLogin
      } else if (this.topicType === 'allTopic') {
        this.isShow = true
      }
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
    // 点击用户名后可查看详情并关注
    showUserInfor (userId, userName) {
      this.isShowInforPanel = true
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
    },
    // 检查是否关注，修改按钮样式
    checkFollow () {
      if (this.isFollow) {
        return '取消关注'
      } else {
        return '关注'
      }
    },
    // 点击按钮后，关注或取消关注
    followUser (userId) {
      if (!this.isFollow) { // 关注
        this.$axios.post('/api/newFans', {
          userId: userId,
          fansId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.$Message.success('关注成功！')
            this.isFollow = true
          } else {
            this.$Message.error('关注失败！')
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
        })
      } else { // 取消关注
        this.$axios.post('/api/deleteFansById', {
          userId: userId,
          fansId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.$Message.success('取消关注成功！')
            this.isFollow = false
          } else {
            this.$Message.error('取消关注失败！')
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
        })
      }
    },
    // 跳转页面，查看详情
    getTopicDetail (data) {
      this.$Message.success('这里是点击之后查看主题id' + data)
    },
    getTopicSort (sort) {
      if (sort === 1) {
        return '与你一起'
      } else if (sort === 2) {
        return '乐享校园'
      } else if (sort === 3) {
        return '校园帮帮'
      } else if (sort === 4) {
        return '团团纳新'
      } else if (sort === 5) {
        return '学习交流'
      } else if (sort === 6) {
        return '你我易起'
      } else if (sort === 7) {
        return '寻物启事'
      } else if (sort === 8) {
        return '兼职招聘'
      } else {
        return '未知分类'
      }
    },
    // 点击点赞标签
    praiseClick (index, num) {
      this.$set(this.followTopic[index], 'topic_praise', num + 1)
      this.$Message.success('已经点赞咯')
    },
    // 点击展开快捷回复栏
    replyClick (index, topicId) {
      if (this.replySelected === index) {
        this.replySelected = -1
      } else {
        this.replySelected = index
      }
      // 获取用户回复信息
      this.$axios.post('/api/findReplyByTopicId', {
        topicId: topicId
      }).then(data => {
        console.log('获取用户回复信息')
        if (data.data !== null) {
          this.replyList = data.data
        }
      })
    },
    // 点击分享按钮
    shareClick (index, topicId) {
      this.$Message.success('分享成功，主题id为：' + topicId)
    },
    // 点击分享按钮
    collectionClick (index, topicId) {
      this.$Message.success('收藏成功，主题id为：' + topicId)
    },
    // 发送快捷回复
    replyPublish (topicId) {
      var t = new Date().getTime()
      t = parseInt(t / 1000)
      this.$axios.post('/api/newReply', {
        topicId: topicId,
        userId: this.userId,
        userName: this.userName,
        replyContent: this.quickReply,
        replyDate: t,
        replyImage: ''
      }).then(response => {
        console.log('提交快捷回复')
        if (response.data === 'SUCCESS') {
          this.$Message.success('回复成功！')
          this.replySelected = -1
        } else {
          this.$Message.error('抱歉，回复失败！')
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
      })
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

/* 用户的主题 */
.recommend-topic {
  width: auto;
  height: auto;
  text-align: left;
  background: #ffffff;
}

.recommend-topic p {
  font-size: 20px;
  font-weight: bolder;
  color: #17233d;
  line-height: 100%;
}

.topic-content {
  font-size: 16px;
  color: #17233d;
  margin-top: 10px;
}

.topic-img {
  float: left;
  height: auto;
  width: 118px;
  /* height: 140px;
  width: auto; */
  margin-right: 15px;
}

.content-text {
  width: auto;
  margin-right: 5px;
}

.topic-infor {
  float: left;
  width: 100%;
  height: auto;
  margin: 16px 0 14px 0;
}

.infor-detail {
  float: left;
  width: auto;
  margin-right: 16px;
}

.infor-icon {
  float: left;
  width: auto;
  margin: 4px 6px 0 0;
}

.topic-infor a {
  font-size: 14px;
  width: auto;
  color: #515a6e;
  text-decoration: none;
  margin: 0 0px 0 4px;
}

.follow-infor {
  width: 100%;
  height: 60px;
}
/* 用户头像 */
.follow-infor img {
  float: left;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: solid #ffffff 1px;
}

.follow-infor-detail {
  float: left;
  margin: 0 0 0 10px;
  height: 100%;
}

.follow-infor-detail a {
  float: left;
  text-decoration: none;
  height: 50%;
  width: 100%;
  color: #515a6e;
}

.detail-username {
  font-size: 16px;
  font-weight: bold;
}

.detail-topicdate {
  font-size: 14px;
}

.infor-icon1 {
  float: left;
  color: #515a6e;
  height: 100%;
  width: auto;
  margin: 4px 6px 0 0;
}
/* 展开回复信息 */
.reply-show {
  width: 100%;
  height: auto;
  margin: 0 0 0px 0;
  color: #515a6e;
}
/* 回复人的小头像 */
.reply-user-portrait {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: solid #ffffff 1px;
}

.reply-show a{
  text-decoration: none;
  color: #515a6e;
}

.reply-detail {
  float: left;
  width: 80%;
  height: 50px;
}
/* 回复昵称和时间 */
.reply-user,.reply-date {
  float: left;
  width: 80%;
  height: 25px;
  margin-left: 10px;
}
/* 回复内容 */
.reply-content {
  float: left;
  width: 100%;
  margin: 0 10px 10px 0;
  padding-right: 10px;
}
/* 快捷回复栏 */
.quick-reply {
  float: left;
  width: 100%;
  margin: 0 0 20px 0;
}

.quick-reply input {
  float: left;
  height: 30px;
  width: 80%;
  text-indent: 8px;
}

.reply-button {
  float: left;
  margin-left: 10px;
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
</style>
