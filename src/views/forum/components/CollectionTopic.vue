<template>
  <div id='app'
       v-if="!isDelete">
    <div class='collection-left'>
      <Button :class="{'praise-button':praiseState<1,'praise-button-click':praiseState==1}"
              @click="praiseClick()">
        <transition name="fade">
          <Icon type="md-arrow-dropup"
                v-if='isShowDetail' />
        </transition>
        <span class='praise-count'
              icon='md-arrow-dropup'>{{ collectionTopic.topic_praise }}</span>
      </Button>

      <Button :class="{'praise-button':praiseState>-1,'praise-button-click':praiseState<0}"
              icon='md-arrow-dropdown'
              v-if='isShowDetail'
              @click="praiseCancel()"></Button>
    </div>
    <!-- 用户主题展示-->
    <div class='collection-topic'>
      <!-- 关注人的主题信息，包括用户名头像发送时间 -->
      <div class='collection-infor'>
        <img :src="checkImg(collectionTopic.user_portrait)?require('@/assets/img/'+collectionTopic.user_portrait):require('@/assets/img/blank.png')"
             @click='showUserInfor(collectionTopic.user_id,collectionTopic.user_name)'>
        <!-- 名字和发送时间 -->
        <div class='collection-infor-detail'>
          <a class='detail-username'>{{ collectionTopic.user_name }}</a>
          <a class='detail-topicdate'>{{ formartDate(collectionTopic.topic_date) }}</a>
        </div>
      </div>
      <div class='topic-content'
           @click='getTopicDetail(topic.college_id)'>
        <!-- 主题图片 -->
        <img :src="checkImg(collectionTopic.topic_img)?require('@/assets/img/'+collectionTopic.topic_img):require('@/assets/img/blank.png')"
             class='topic-img'
             :style="{display:checkImg(collectionTopic.topic_img)?'':'none'}">
        <div class='content-text'
             v-if="!isShowDetail">{{ substr(collectionTopic.topic_content) }}...<a @click='showDetail()'
             v-if='isBeyond'>显示全部↓</a></div>
        <div class='content-text'
             v-if="isShowDetail">{{ collectionTopic.topic_content }}<a @click='showDetail()'
             v-if='isBeyond'>收起↑</a></div>
      </div>
      <!-- 最后一行的按钮 -->
      <div class='topic-infor'>
        <div class='infor-detail'>
          <Icon type="ios-chatbubbles"
                class='infor-icon1' />
          <a @click='replyClick()'>{{ replyButtonTitle }}</a>
        </div>
        <div class='infor-detail'>
          <Icon type="ios-share-alt"
                class='infor-icon1' />
          <a @click='shareClick(collectionTopic.topic_id)'>分享</a>
        </div>
        <div class='infor-detail'>
          <Icon type="md-star"
                class='infor-icon1' />
          <a @click='collectionCancel(collectionTopic.topic_id)'>取消收藏</a>
        </div>
      </div>
      <!-- 快捷回复栏 -->
      <div class='quick-reply'
           v-if='isReplyShow'>
        <!-- 回复简略信息 -->
        <div class='reply-show'
             v-for='(reply,index) in replyList'
             :key='index'>
          <!-- 用户头像 -->
          <img :src="checkImg(reply.user_portrait)?require('@/assets/img/'+reply.user_portrait):require('@/assets/img/blank.png')"
               class='reply-user-portrait'
               @click='showUserInfor(reply.user_id,reply.user_name)'>
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
                @click='replyPublish(collectionTopic.topic_id)'>
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
  name: 'collectionTopic',
  inject: ['reload'],
  props: {
    collectionTopic: {
      type: Array,
      require: true
    },
    userId: {
      type: String,
      require: true
    },
    userName: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      isShowDetail: false,
      praiseState: 0,
      isBeyond: false,
      isReplyShow: false,
      replyButtonTitle: '',
      praiseCount: '',
      isDelete: false,
      replyList: []
    }
  },
  methods: {
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
    // 跳转页面，查看详情
    getTopicDetail (topicId, collegeId) {
      this.$store.commit('setTopicId', topicId)
      this.$store.commit('setCollegeId', collegeId)
      this.$router.push('/topicDetail')
    },
    // 点赞
    praiseClick () {
      if (!this.isShowDetail) {
        this.isShowDetail = true
        return
      }
      if (this.praiseState === 0) {
        this.newTopicPraise()
      } else if (this.praiseState === -1) {
        this.newTopicPraise()
      } else {
        this.praiseState = 0
        this.cancelTopicPraise()
        this.$set(this.collectionTopic, 'topic_praise', this.collectionTopic.topic_praise - 1)
      }
    },
    // 踩
    praiseCancel () {
      if (this.praiseState === 0) {
        this.praiseState -= 1
      } else if (this.praiseState === 1) {
        this.deleteTopicPraise()
      } else {
        this.praiseState = 0
        this.cancelTopicPraise()
      }
    },
    // 发送点赞请求
    newTopicPraise () {
      this.$axios.post('/api/updateTopicPraise', {
        userId: this.userId,
        topicId: this.collectionTopic.topic_id,
        praiseState: 1
      }).then(data => {
        if (data.data === 'SUCCESS') {
          var count = this.collectionTopic.topic_praise + 1
          if (count - this.praiseCount <= 1) { this.$set(this.collectionTopic, 'topic_praise', this.collectionTopic.topic_praise + 1) }
          this.praiseState = 1
        }
      })
    },
    // 发送取消点赞请求
    deleteTopicPraise () {
      this.$axios.post('/api/updateTopicPraise', {
        userId: this.userId,
        topicId: this.collectionTopic.topic_id,
        praiseState: -1
      }).then(data => {
        if (data.data === 'SUCCESS') {
          var count = this.collectionTopic.topic_praise - 1
          if (this.praiseCount - count <= 1) { this.$set(this.collectionTopic, 'topic_praise', this.collectionTopic.topic_praise - 1) }
          this.praiseState = -1
        }
      })
    },
    // 发送取消状态请求
    cancelTopicPraise () {
      this.$axios.post('/api/updateTopicPraise', {
        userId: this.userId,
        topicId: this.collectionTopic.topic_id,
        praiseState: 0
      }).then(data => {
      })
    },
    // 显示全部和收起
    showDetail () {
      this.isShowDetail = !this.isShowDetail
    },
    // 点击展开快捷回复栏
    replyClick () {
      this.isReplyShow = !this.isReplyShow
      this.replyButtonTitle = this.isReplyShow ? '收起回复' : this.replyList.length + '条回复'
    },
    // 发送快捷回复
    replyPublish (topicId) {
      if (this.replyContent !== '') {
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
          if (response.data === 'SUCCESS') {
            this.$Message.success('回复成功！')
            this.quickReply = ''
            this.getReply()
          } else {
            this.$Message.error('抱歉，回复失败！')
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
        })
      } else {
        this.$Message.warning('请输入回复内容')
      }
    },
    // 获取点赞状态
    getPraiseState () {
      this.$axios.post('/api/findTopicPraiseRelation', {
        userId: this.userId,
        topicId: this.collectionTopic.topic_id
      }).then(data => {
        if (data.data != null) {
          this.praiseState = data.data.praise_state
        } else {
          this.praiseState = 0
        }
        this.praiseCount = this.collectionTopic.topic_praise
      })
    },
    // 获取回复内容
    getReply () {
      // 获取用户回复信息
      this.$axios.post('/api/findReplyByTopicId', {
        topicId: this.collectionTopic.topic_id
      }).then(data => {
        console.log('获取用户回复信息')
        if (data.data !== null) {
          this.replyList = data.data
          this.replyButtonTitle = this.replyList.length + '条回复'
        }
      })
    },
    // 点击分享按钮
    shareClick (topicId) {
      this.$Message.success('分享成功，主题id为：' + topicId)
    },
    // 取消收藏
    collectionCancel (topicId) {
      this.$axios.post('/api/deleteCollectionById', {
        userId: this.userId,
        collectionId: topicId
      }).then(data => {
        // 更新列表
        if (data.data === 'SUCCESS') {
          this.$Message.success('取消收藏成功！')
          this.isDelete = true
        }
      })
    },
    // 截取字符串，实现“显示更多”功能
    substr (str) {
      var maxLength = 180
      if (str.length > maxLength) {
        this.isBeyond = true
        return str.substring(0, maxLength)
      } else {
        return str
      }
    }
  },
  // 生命周期函数，打开页面后自动运行
  created () {
    this.getPraiseState()
    this.getReply()
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
.collection-topic {
  width: auto;
  height: auto;
  text-align: left;
  background: #ffffff;
}

.collection-topic p {
  font-size: 20px;
  font-weight: bolder;
  color: #17233d;
  line-height: 100%;
}

.collection-left {
  float: left;
  width: 50px;
  min-height: 100px;
}
.praise-button {
  width: 40px;
  height: auto;
  margin: 4px auto;
  background-color: rgb(239, 246, 250);
}

.praise-button-click {
  width: 40px;
  height: auto;
  margin: 4px auto;
  color: white;
  background-color: rgb(105, 142, 191);
}

.praise-count {
  float: left;
  height: 18px;
  margin-left: 2px;
  text-align: center;
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
  margin: 0 15px 0 10px;
}

.content-text {
  width: auto;
  margin-left: 60px;
}

.topic-infor {
  float: left;
  width: 100%;
  height: auto;
  margin: 16px 0 14px 60px;
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

.collection-infor {
  width: 100%;
  height: 60px;
  margin-left: 60px;
}
/* 用户头像 */
.collection-infor img {
  float: left;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: solid #ffffff 1px;
}

.collection-infor-detail {
  float: left;
  margin: 0 0 0 10px;
  height: 100%;
}

.collection-infor-detail a {
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

.reply-show a {
  text-decoration: none;
  color: #515a6e;
}

.reply-detail {
  float: left;
  width: 80%;
  height: 50px;
}
/* 回复昵称和时间 */
.reply-user,
.reply-date {
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
  margin: 0 0 20px 60px;
}

.quick-reply input {
  float: left;
  height: 30px;
  width: 79%;
  text-indent: 8px;
}

.reply-button {
  float: left;
  margin-left: 10px;
}
</style>
