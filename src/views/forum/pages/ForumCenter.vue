<template>
  <div id='app'>
    <div id='forum-detail'>

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
            <p>粉丝 {{ fansNum }}</p>
            <p>关注 {{ followNum }}</p>
            <p>主题数 {{ userInfor.infor_topic_num }}</p>
            <p>个性签名: {{ userInfor.infor_autograph }}</p>
          </div>

        </div>
      </Modal>

      <!-- 页面头部，左边轮播图用来展示一些校园活动，右边是欢迎图片 -->
      <div class='head'>
        <div class='head-left'>
          <Carousel autoplay
                    :autoplay-speed="autoplaySpeed"
                    style='width:100%;height:100%'
                    loop>
            <CarouselItem>
              <div class="demo-carousel"><img class="activity-img"
                     v-bind:src='actImg1'></div>
            </CarouselItem>
            <CarouselItem>
              <div class="demo-carousel"><img class="activity-img"
                     v-bind:src='actImg2'></div>
            </CarouselItem>
            <CarouselItem>
              <div class="demo-carousel"><img class="activity-img"
                     v-bind:src='actImg3'></div>
            </CarouselItem>
            <CarouselItem>
              <div class="demo-carousel"><img class="activity-img"
                     v-bind:src='actImg4'></div>
            </CarouselItem>
          </Carousel>
        </div>
        <!-- 头部右侧，欢迎图片 -->
        <div class='head-right'>
          <img v-bind:src='welcomeSrc'
               style='width:100%;height:100%'>
        </div>
      </div>

      <!-- 主界面左边，展示推荐和关注（分区展示，点击可以跳转到主题详情页） -->
      <div class='left'>
        <Tabs style='height:100%;width:100%'>
          <!-- 推荐页面，展示当前比较火的主题 -->
          <TabPane label="推荐"
                   name="recommend">
            <!-- 主题主体 -->
            <div class='recommend-topic'
                 v-for='(topic,index) in allTopic'
                 :key='index'>
              <Poptip trigger="hover"
                      :title='topic.college_name'
                      :content='getTopicSort(topic.topic_sort)'
                      placement="right-start">
                <p>{{ topic.topic_title }}</p>
              </Poptip>
              <div class='topic-content'
                   @click='getTopicDetail(topic.topic_id,topic.college_id)'>

                <img :src="checkImg(topic.topic_img)?require('@/assets/img/'+topic.topic_img):require('@/assets/img/blank.png')"
                     class='topic-img'
                     :style="{display:checkImg(topic.topic_img)?'':'none'}">
                <div class='content-text'>{{ topic.topic_content }}</div>
              </div>
              <!-- 主题信息，作者时间等，显示在最后一排 -->
              <div class='topic-infor'>
                <div class='infor-detail'>
                  <Icon type="ios-person-outline"
                        class='infor-icon' />
                  <a @click='showUserInfor(topic.user_id,topic.user_name)'>{{ topic.user_name }}</a>
                </div>
                <div>
                  <Icon type="ios-time-outline"
                        class='infor-icon' />
                  <a>{{ formartDate(topic.topic_date) }}</a>
                </div>
              </div>
              <Divider />
            </div>

          </TabPane>

          <!-- 关注页面，展示自己关注的人的主题（未登录帐号则显示登录按钮） -->
          <TabPane label="关注"
                   name="follow">
            <!-- 登录按钮，当未登录时显示 -->
            <router-link to="/login">
              <Button class='login-button'
                      type="primary"
                      :style="{display:!isLogin?'':'none'}">
                点击登录，享受精彩校园
              </Button>
            </router-link>
            <!-- 将获取的主题信息传入子组件 -->
            <user-topic v-bind:followTopic='followTopic' :topicType='topicType'/>

          </TabPane>
        </Tabs>
      </div>
      <!-- 主界面右边，显示自己关注的校园和一些常用小功能 -->
      <div class='right'>
        <!-- 显示关注的校园 -->
        <div class='follow-college'>
          <p>关注的校园</p>
          <!-- 未登录显示提示登录按钮 -->
          <router-link to="/login">
            <Button style='margin:0 auto;margin-top:15%'
                    type="primary"
                    :style="{display:!isLogin?'':'none'}">
              还没有登录哦
            </Button>
          </router-link>
          <!-- 未登录就不显示关注列表 -->
          <div :style="{display:isLogin?'':'none'}">
            <div class='college-choice'
                 v-for='(forumName,index) in collegeUser'
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

        </div>
        <!-- 显示常用功能 -->
        <div class='commonly'>
          <!-- 常用功能菜单 -->
          <commonly-menu />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import UserTopic from '../components/UserTopic'
import CommonlyMenu from '../components/CommonlyMenu'
// 固定写法，参数的赋值
export default {
  name: 'forumCenter',
  inject: ['reload'],
  components: {
    'user-topic': UserTopic,
    'commonly-menu': CommonlyMenu
  },
  data () {
    return {
      welcomeSrc: require('@/assets/img/welcome.png'),
      actImg1: require('@/assets/img/head_back.png'),
      actImg2: require('@/assets/img/head_back1.png'),
      actImg3: require('@/assets/img/head_back2.png'),
      actImg4: require('@/assets/img/head_back4.png'),
      autoplaySpeed: 4000,
      topicType: 'followTopic',
      isLogin: false,
      userId: '',
      userName: '',
      replySelected: -1,
      quickReply: '',
      isShowInforPanel: false,
      fansNum: '',
      followNum: '',
      isFollow: false,
      collegeUser: [],
      allTopic: [], // 所有的主题
      followTopic: [], // 关注的人的主题
      userInfor: [{
        infor_portrait: 'blank.png',
        infor_name: '',
        infor_topic_num: '',
        infor_autograph: ''
      }]
    }
  },
  // 一些页面交互相关方法
  methods: {
    // 从Cookie获取登录状态
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
      if (this.isLogin) {
        this.syncUserPage()
      }
      console.log('当前登录状态为' + this.isLogin)
      setTimeout(() => {
        // 更新信息，跳转页面
        this.$store.state.isLogin = true
        this.$store.state.userId = this.userId
        this.$store.state.userName = this.name
        this.setCookie('isLogin', true, 7)
        this.$router.push('/forumCenter')
      }, 500)
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
      // 获取基本信息
      this.$axios.post('/api/findByCondition', {
        name: userName
      }).then(data => {
        this.userInfor = data.data
      })
      // 获取粉丝数量
      this.$axios.post('/api/findFansByUserId', {
        userId: userId
      }).then(data => {
        this.fansNum = data.data === null ? 0 : data.data.length
      })
      // // 获取关注数量
      this.$axios.post('/api/findUserByFansId', {
        fansId: userId
      }).then(data => {
        this.followNum = data.data === null ? 0 : data.data.length
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
    // 获取校园分类名
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
    // 点击选择进入某个校园
    collegeChoice (index, collegeId) {
      this.$store.commit('setCollegeId', collegeId)
      this.$router.push('/collegeDetail')
    },
    // 点击关注更多校园
    collegeMore () {
      this.$Message.success('跳转到更多校园页面')
    },
     // 跳转页面，查看详情
    getTopicDetail (topicId, collegeId) {
      this.$store.commit('setTopicId', topicId)
      this.$store.commit('setCollegeId', collegeId)
      this.$router.push('/topicDetail')
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
    // 发送请求，更新用户相关页面信息
    syncUserPage () {
      console.log('这里输出查找的userId：' + this.userId)
      // 请求关注的校园信息
      this.$axios.post('/api/findCollegeInforByUserId', {
        userId: this.userId
      }).then(data => {
        console.log('获取关注的校园')
        if (data.data !== null) {
          this.collegeUser = data.data
        }
      })
      // 请求关注的用户主题
      this.$axios.post('/api/findFollowTopicByUserId', {
        userId: this.userId
      }).then(data => {
        console.log('获取关注的用户主题')
        if (data.data !== null) {
          this.followTopic = data.data
        }
      })
    },
    // 发送请求，更新所有页面信息
    syncPage () {
      // 请求所有主题
      this.$axios.get('/api/getAllTopic', {
      }).then(data => {
        console.log('获取所有的主题')
        if (data.data !== null) {
          this.allTopic = data.data
        }
      })
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
  height: 6000px;
  background: #f8f8f9;
}

#forum-detail {
  width: 68%;
  height: 100%;
  margin: 0 auto;
  margin-top: 10px;
}
/* 头部的大小定义 */
.head {
  position: relative;
  width: 100%;
  height: 190px;
}

.head-left {
  position: relative;
  float: left;
  height: 100%;
  width: 68%;
  margin-right: 1%;
  background: #ffffff;
}

.head-right {
  position: relative;
  float: left;
  height: 100%;
  width: 31%;
}

.activity-img {
  height: 190px;
  width: 60%;
}

.left {
  position: relative;
  float: left;
  margin-top: 10px;
  margin-right: 1%;
  width: 68%;
  height: auto;
  padding-left: 20px;
  padding-right: 20px;
  background: #ffffff;
}

.login-button {
  position: relative;
  margin: 0 auto;
  text-align: center;
  top: 100px;
}

.right {
  position: relative;
  float: left;
  margin-top: 10px;
  width: 31%;
  height: 70%;
}
/* 关注的校园 */
.follow-college {
  width: 100%;
  height: auto !important;
  height: 400px;
  min-height: 200px;
  background: #ffffff;
}

/* 关注的校园 */
.follow-college p {
  width: auto;
  height: 50px;
  margin-left: 25px;
  line-height: 50px;
  font-size: 14px;
  text-align: left;
  color: #515a6e;
}
/* 校园选择按钮 */
.college-button {
  float: left;
  width: 41%;
  height: 40px;
  margin-left: 6%;
  margin-bottom: 15px;
}
/* 清除浮动，使校园显示能够自适应高度 */
.clearfloat {
  clear: both;
  height: 0;
  font-size: 1px;
  line-height: 0px;
}
/* 常用功能 */
.commonly {
  width: 100%;
  height: auto;
  margin-top: 10px;
  background: #ffffff;
}

/* 推荐的主题 */
.recommend-topic {
  width: auto;
  height: auto;
  text-align: left;
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
