<template>
  <div id='app'>
    <div id='college-detail'>

      <!-- 页面头部，左边轮播图用来展示一些校园活动，右边是欢迎图片 -->
      <div class='head'>
        <div class='head-left'>
          这里是校园详情页面！
        </div>
        <!-- 头部右侧，欢迎图片 -->
        <div class='head-right'>

        </div>
      </div>

      <!-- 主界面左边，展示推荐和关注（分区展示，点击可以跳转到主题详情页） -->
      <div class='left'>
        <Tabs style='height:100%;width:100%'>
          <!-- 推荐页面，展示当前比较火的主题 -->
          <TabPane label="推荐"
                   name="recommend">

          </TabPane>

          <!-- 关注页面，展示自己关注的人的主题（未登录帐号则显示登录按钮） -->
          <TabPane label="关注"
                   name="follow">
          </TabPane>
        </Tabs>
      </div>
      <!-- 主界面右边，显示自己关注的校园和一些常用小功能 -->
      <div class='right'>

      </div>

    </div>
  </div>
</template>

<script>
import UserTopic from '../components/UserTopic'
// 固定写法，参数的赋值
export default {
  name: 'forumCenter',
  inject: ['reload'],
  components: {
    'user-topic': UserTopic
  },
  data () {
    return {
      welcomeSrc: require('@/assets/img/welcome.png'),
      actImg1: require('@/assets/img/head_back.png'),
      actImg2: require('@/assets/img/head_back1.png'),
      actImg3: require('@/assets/img/head_back2.png'),
      actImg4: require('@/assets/img/head_back4.png'),
      autoplaySpeed: 4000,
      isLogin: false,
      userId: '',
      userName: '',
      replySelected: -1,
      quickReply: '',
      isShowInforPanel: false,
      isFollow: false,
      collegeUser: [],
      allTopic: [], // 所有的主题
      followTopic: [], // 关注的人的主题
      userInfor: [{
        infor_portrait: 'portrait.png',
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
    // 发送请求，更新所有页面信息
    syncPage () {

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
  height: 2000px;
  background: #f8f8f9;
}
/* 校园详情 */
#college-detail {
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
/* 头部左边 */
.head-left {
  position: relative;
  float: left;
  height: 100%;
  width: 68%;
  margin-right: 1%;
  /* background: #ffffff; */
  background-color: aqua;
}
/* 头部右边 */
.head-right {
  position: relative;
  float: left;
  height: 100%;
  width: 31%;
  background-color: red;
}
/* 左边界面 */
.left {
  position: relative;
  float: left;
  margin-top: 10px;
  margin-right: 1%;
  width: 68%;
  height: auto;
  padding-left: 20px;
  /* background: #ffffff; */
  background-color: purple;
}
/* 右边界面 */
.right {
  position: relative;
  float: left;
  margin-top: 10px;
  width: 31%;
  height: 600px;
  background-color: goldenrod;
}

</style>
