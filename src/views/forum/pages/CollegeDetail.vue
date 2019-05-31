<template>
  <div id='app'>
    <div id='college-detail'>

      <!-- 页面头部，左边轮播图用来展示一些校园活动，右边是欢迎图片 -->
      <div class='head'>
        <div class='head-left'>
          <!-- 校园信息 -->
          <img :src="checkImg(collegeInfor.college_portrait)?require('@/assets/img/'+collegeInfor.college_portrait):require('@/assets/img/blank.png')"
               class='college-img'>
          <a class='college-name'>{{ collegeInfor.college_name }}</a>
          <Button class='follow-button'
                  :type="isFollow?'warning':'primary'"
                  :style="{display:isLogin?'':'none'}"
                  @click='followCollege(collegeId)'>{{ checkFollow() }}</Button>
          <a class='college-summary'>{{ collegeInfor.college_summary }}</a>
        </div>
        <!-- 头部右侧，下载app推荐 -->
        <div class='head-right'>
          <a class='head-right-title'>扫描二维码下载校园客户端</a>
          <a class='head-right-text'>下载校园App</a>
          <a class='head-right-text'>更多精彩内容、等你发现！</a>
          <img :src='downloadApp'
               class='download-img'>
        </div>
      </div>

      <!-- 主界面左边，展示推荐和关注（分区展示，点击可以跳转到主题详情页） -->
      <div class='left'>
        <Tabs style='height:100%;width:100%'>
          <!-- 与你一起板块，交友约玩平台-->
          <TabPane label="与你一起"
                   name="sort1">
            <!-- 将获取的主题信息传入子组件，显示对应分类下的所有主题 -->
            <user-topic v-bind:followTopic='sortTopic1' :topicType='topicType' />
          </TabPane>
          <!-- 乐享校园板块，分享校园新鲜事 -->
          <TabPane label="乐享校园"
                   name="sort2">
            <user-topic v-bind:followTopic='sortTopic2' :topicType='topicType' />
          </TabPane>
          <!-- 校园帮帮，代取快递送伞等校园实时帮助委托类主题-->
          <TabPane label="校园帮帮"
                   name="sort3">
            <user-topic v-bind:followTopic='sortTopic3' :topicType='topicType' />
          </TabPane>
          <!-- 团团纳新板块，社团纳新信息展示 -->
          <TabPane label="团团纳新"
                   name="sort4">
            <user-topic v-bind:followTopic='sortTopic4' :topicType='topicType' />
          </TabPane>
          <!-- 学习交流板块，分享学习心得和资料 -->
          <TabPane label="学习交流"
                   name="sort5">
            <user-topic v-bind:followTopic='sortTopic5' :topicType='topicType' />
          </TabPane>
          <!-- 你我易起板块，交易主题专用 -->
          <TabPane label="你我易起"
                   name="sort6">
            <user-topic v-bind:followTopic='sortTopic6' :topicType='topicType' />
          </TabPane>
          <!-- 寻物启事板块，寻物启事失物招领 -->
          <TabPane label="寻物启事"
                   name="sort7">
            <user-topic v-bind:followTopic='sortTopic7' :topicType='topicType' />
          </TabPane>
          <!-- 兼职招聘板块，兼职信息提供展示平台 -->
          <TabPane label="兼职招聘"
                   name="sort8">
            <user-topic v-bind:followTopic='sortTopic8' :topicType='topicType' />
          </TabPane>

        </Tabs>
      </div>
      <!-- 主界面右边，显示自己关注的校园和一些常用小功能，可以作为公共组件使用 -->
      <div class='right'>
        <!-- 常用功能菜单 -->
        <commonly-menu />
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
      downloadApp: require('@/assets/img/downloadApp.png'),
      topicType: 'allTopic',
      isLogin: false,
      userId: '',
      userName: '',
      collegeId: '',
      isFollow: true,
      collegeInfor: [], // 校园信息
      sortTopic1: [], // 不同分类下校园主题列表
      sortTopic2: [],
      sortTopic3: [],
      sortTopic4: [],
      sortTopic5: [],
      sortTopic6: [],
      sortTopic7: [],
      sortTopic8: []
    }
  },
  // 一些页面交互相关方法
  methods: {
    // 从Cookie获取登录状态和校园id
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
      this.collegeId = sessionStorage['collegeId']
      console.log('跳转校园详情后获得的校园id：' + this.collegeId)
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
    // 检查是否关注，修改按钮样式
    checkFollow () {
      if (this.isFollow) {
        return '取消关注'
      } else {
        return '关注'
      }
    },
    // 点击按钮后，关注或取消关注校园
    followCollege (userId) {
      if (!this.isFollow) { // 关注
        this.$axios.post('/api/newUserFollow', {
          collegeId: this.collegeId,
          userId: this.userId
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
        this.$axios.post('/api/deleteFollowById', {
          collegeId: this.collegeId,
          userId: this.userId
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
    // 获取各个分类下的主题内容
    getSortTopic () {
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 1
      }).then(data => {
        if (data.data != null) {
          this.sortTopic1 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 2
      }).then(data => {
        if (data.data != null) {
          this.sortTopic2 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 3
      }).then(data => {
        if (data.data != null) {
          this.sortTopic3 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 4
      }).then(data => {
        if (data.data != null) {
          this.sortTopic4 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 5
      }).then(data => {
        if (data.data != null) {
          this.sortTopic5 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 6
      }).then(data => {
        if (data.data != null) {
          this.sortTopic6 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 7
      }).then(data => {
        if (data.data != null) {
          this.sortTopic7 = data.data
        }
      })
      this.$axios.post('/api/findTopicBySort', {
        collegeId: this.collegeId,
        topicSort: 8
      }).then(data => {
        if (data.data != null) {
          this.sortTopic8 = data.data
        }
      })
    },
    // 发送请求，更新所有页面信息
    syncPage () {
      // 判断是否已经关注
      if (this.isLogin) {
        this.$axios.post('/api/findRelationById1', {
          collegeId: this.collegeId,
          userId: this.userId
        }).then(response => {
          if (response.data === 'SUCCESS') {
            this.isFollow = true
          } else {
            this.isFollow = false
          }
        })
      }
      this.getSortTopic()
      this.getCollegeInfor()
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
  height: 3500px;
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
  background: #ffffff;
}
/* 校园图片 */
.college-img {
  float: left;
  width: 150px;
  height: 150px;
  margin: 20px 0 0 20px;
}
/* 校园名称 */
.college-name {
  float: left;
  margin: 20px 0 0 20px;
  font-size: 24px;
  font-weight: bold;
  color: #17233d;
}
/* 校园关注按钮 */
.follow-button {
  float: left;
  margin: 20px 0 0 20px;
}
/* 校园简介 */
.college-summary {
  float: left;
  width: 70%;
  font-size: 20px;
  margin: 20px 0 20px 20px;
  color: #515a6e;
  text-align: left;
}
/* 头部右边 */
.head-right {
  position: relative;
  float: left;
  height: 100%;
  width: 31%;
  background-color: #ffffff;
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
  /* height: 5000px; */
  padding-left: 20px;
  background: #ffffff;
}
/* 右边界面 */
.right {
  position: relative;
  float: left;
  margin-top: 10px;
  width: 31%;
  height: auto;
  min-height: 100px;
  background: #ffffff;
}
.head-right a {
  float: left;
  text-align: left;
  color: #17233d;
  text-decoration: none;
  margin: 25px 0 0 20px;
}
.head-right-title {
  font-size: 18px;
  font-weight: bold;
  width: 100%;
}
.head-right-text {
  font-size: 14px;
  width: 56%;
}
/* 下载二维码图片 */
.download-img {
  float: left;
  width: 100px;
  height: 100px;
  margin-top: -40px;
}
</style>
