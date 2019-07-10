<template>
  <div id='app'>
    <div id='collection-detail'>
      <!-- 左边收藏列表 -->
      <div class='detail-left'>
        <Tabs value="name1">
          <TabPane label="我的收藏夹"
                   name="name1">
            <collection-topic v-for='(c,index) in collectionTopic'  :key='index'  :collectionTopic='c' :userId='userId' :userName='userName'/>
          </TabPane>
        </Tabs>
      </div>
      <!-- 右边功能菜单 -->
      <div class='detail-right'>

      </div>
    </div>
  </div>
</template>

<script>
import CollectionTopic from '../components/CollectionTopic'
// 固定写法，参数的赋值
export default {
  name: 'collectionDetail',
  components: {
    'collection-topic': CollectionTopic
  },
  data () {
    return {
      isLogin: '',
      userId: '',
      userNama: '',
      collectionTopic: []
    }
  },
  methods: {
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
    },
    // 获取用户收藏的主题
    getCollection () {
      this.$axios.post('/api/findCollectionByUserId', {
        userId: this.userId
      }).then(response => {
        if (response.data !== null) {
          this.collectionTopic = response.data
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
    this.getCollection()
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#app {
  position: relative;
  width: 100%;
  height: auto;
  background: #ffffff;
}

#collection-detail {
  width: 100%;
  height: auto;
  min-height: 1600px;
}

.detail-left {
  float: left;
  height: auto;
  min-height: 100%;
  width: 60%;
  padding: 10px 0 100px 16%;
  background: #ffffff;
}

.detail-right {
  float: right;
  height: 100%;
  width: 40%;
  padding: 10px 10% 100px 0;
  background: #ffffff;
}
</style>
