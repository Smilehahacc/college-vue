<template>
  <div id='app'>
    <Menu style='width:100%;text-align:left'
          active-name="1"
          @on-select='commonlyMenu'>
      <MenuGroup title="常用功能">
        <MenuItem name='1'
                  :style="{display:isLogin?'':'none'}">
        <Icon type="ios-leaf" />
        关注的人
        </MenuItem>
        <MenuItem name='2'
                  :style="{display:isLogin?'':'none'}">
        <Icon type="md-heart" />
        我的粉丝
        </MenuItem>
        <MenuItem name='3'
                  :style="{display:isLogin?'':'none'}">
        <Icon type="ios-analytics" />
        主题收藏
        </MenuItem>
        <MenuItem name='4'
                  :style="{display:isLogin?'':'none'}">
        <Icon type="ios-chatbubbles" />
        评论留言
        </MenuItem>
        <MenuItem name='5'>
        <Icon type="ios-people" />
        用户反馈
        </MenuItem>

      </MenuGroup>
    </Menu>
  </div>
</template>

<script>
// 固定写法，参数的赋值
export default {
  name: 'commonlyMenu',
  inject: ['reload'],
  props: {
    // isLogin: {
    //   type: Array,
    //   require: true
    // }
  },
  data () {
    return {
      isLogin: false,
      userId: '',
      userName: ''
    }
  },
  // 一些页面交互相关方法
  methods: {
    // 从Cookie获取登录状态
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
    },
     // 右侧常用功能的控制
    commonlyMenu (name) {
      if (name === '1') {
        this.$Message.success('关注的人')
      } else if (name === '2') {
        this.$Message.success('我的粉丝')
      } else if (name === '3') {
        this.$router.push('/collectionDetail')
      } else if (name === '4') {
        this.$Message.success('评论留言')
      } else if (name === '5') {
        this.$Message.success('用户反馈')
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
</style>
