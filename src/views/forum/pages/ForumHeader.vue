<template>
  <div id='app'>
    <BackTop></BackTop>
    <div class='head'>
      <a class='head-title' @click='refresh'>校园</a>
      <a class='head-menu'>首页</a>
      <a class='head-menu'>动态</a>
      <a class='head-menu'>发现</a>
      <div class='search-bar'>
        <Input search
               class='search-input'
               v-bind:placeholder='searchTitle'
               v-model='searchText' />
        <Button class='search-button'
                type="primary">搜索</Button>
      </div>

      <div class='user-bar'>
        <div class='head-icon1'>
          <Icon :style="{display:isLogin?'':'none'}"
                type="ios-notifications-outline"
                size='26'
                @click="information" />
        </div>
        <div class='head-icon2'>
          <Icon :style="{display:isLogin?'':'none'}"
                type="ios-chatbubbles-outline"
                size='26'
                @click="talk" />
        </div>
        <Dropdown trigger="hover"
                  style="margin-left: 20px;margin-top:52px;">
          <a href="javascript:void(0)">
            <Avatar class='user-portrait'
                    v-bind:src='portraitSrc' />
          </a>
          <DropdownMenu slot="list"
                        style="text-align:center">
            <DropdownItem :style="{display:!isLogin?'':'none'}">
              <router-link to="/login"><a class='menu'>登录</a></router-link>
            </DropdownItem>
            <DropdownItem :style="{display:isLogin?'':'none'}"><a class='menu'
                 @click="user">个人中心</a></DropdownItem>
            <DropdownItem :style="{display:isLogin?'':'none'}"><a class='menu'
                 @click="setting">设置</a></DropdownItem>
            <DropdownItem :style="{display:isLogin?'':'none'}"><a class='menu'
                 @click="logout">退出</a></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

    </div>

    <!-- 右侧抽屉界面 -->
    <!-- 消息中心 -->
    <div>
      <Drawer :closable="false"
              width="440"
              v-model="drawerInformation">
        <p>这里消息</p>
      </Drawer>
    </div>
    <!-- 私信 -->
    <div>
      <Drawer :closable="false"
              width="440"
              v-model="drawerTalk">
        <p>这里是私信</p>
      </Drawer>
    </div>
    <!-- 个人中心 -->
    <div>
      <Drawer :closable="false"
              width="440"
              v-model="drawerUser"
              style='margin:0;padding:0'>
        <!-- 用户信息界面 -->
        <div id='userInfor'>
          <div class='user-head'>
            <a href="javascript:void(0)">
              <Avatar class='user-protraitLarge'
                      v-bind:src='portraitSrc'
                      shape='circle' />
            </a>
            <Button type="primary"
                    @click='modifyShow'
                    ghost>修改资料</Button>
            <div class='user-infor'>
              <p class='infor-name'>{{ userInfor.infor_name }}</p>
              <p class='infor-detail'>粉丝 {{ fansNum }}</p>
              <p class='infor-detail'>关注 {{ followNum }}</p>
              <p class='infor-detail'>主题数 {{ userInfor.infor_topic_num }}</p>
              <p class='infor-autograph'>个性签名: {{ userInfor.infor_autograph }}</p>
            </div>
          </div>

          <div class="user-detail">
            <Tabs value="rightTab">
              <TabPane label="主页" name='homepage'>主页</TabPane>
              <TabPane label="动态" name='dynamic'>动态</TabPane>
              <TabPane label="收藏" name='collection'>收藏</TabPane>
            </Tabs>
          </div>
        </div>
      </Drawer>
      <Drawer :closable="false" v-model="isModifyShow" width="340">
        <!-- 用户信息修改表单 -->
        <div id='userInforModify'>
           <div class='modify-head'>
              <a href="javascript:void(0)">
              <Avatar class='user-protraitLarge'
                      v-bind:src='portraitModifySrc'
                      shape='circle' />
              </a>
              <!-- 上传头像按钮 -->
              <Upload class='upload' :max-size='2048' :show-upload-list="false"
              action="//jsonplaceholder.typicode.com/posts/" accept = 'image/*'
              show-upload-list:false :on-progress='uploadSuccess'>
                <Button icon="ios-cloud-upload-outline">上传头像</Button>
              </Upload>

              <!-- 待修改的表单信息 -->
              <p class='modify-title'>用户名</p>
              <Input class='modify-input' v-model="nameModify" placeholder="输入用户名" />
              <p class='modify-title'>邮箱</p>
              <Input class='modify-input' v-model="emailModify" placeholder="输入邮箱" />
              <p class='modify-title'>手机号</p>
              <Input class='modify-input' v-model="phoneModify" placeholder="输入手机号" />
              <p class='modify-title'>个性签名</p>
              <Input style='margin-top:10px' v-model="autographModify" type="textarea" placeholder="输入你想说的吧～" />
              <Button style='float:right;margin-top:30px' type="primary" @click='saveModify'>保存修改</Button>
            </div>

        </div>
      </Drawer>

    </div>
    <!-- 用户设置 -->
    <div>
      <Drawer :closable="false"
              width="440"
              v-model="drawerSetting">
        <p>这里是用户设置</p>
      </Drawer>
    </div>

  </div>
</template>

<script>
// 固定写法，参数的赋值
export default {
  name: 'forumHead',
  inject: ['reload'],
  data () {
    return {
      searchTitle: '输入想搜索的主题吧～',
      searchText: '',
      portraitSrc: '',
      portraitModifyName: '',
      portraitModifySrc: '',
      isLogin: true,
      userName: '',
      userId: '',
      drawerInformation: false,
      drawerTalk: false,
      drawerUser: false,
      drawerSetting: false,
      fansNum: -1,
      followNum: -1,
      topicNum: -1,
      userInfor: [],
      isModifyShow: false,
      nameModify: '',
      emailModify: '',
      phoneModify: '',
      autographModify: ''
    }
  },
  // 一些页面交互相关方法
  methods: {
    // 刷新页面
    refresh () {
      this.reload()
    },
    // 消息
    information () {
      this.drawerInformation = true
    },
    // 对话
    talk () {
      this.drawerTalk = true
    },
    // 个人中心
    user () {
      this.drawerUser = true
    },
    // 用户设置
    setting () {
      this.drawerSetting = true
    },
    // 显示左侧个人信息栏的信息修改页面，更新数据
    modifyShow () {
      this.isModifyShow = true
      this.nameModify = this.userInfor.infor_name
      this.emailModify = this.userInfor.infor_email
      this.phoneModify = this.userInfor.infor_phone
      this.autographModify = this.userInfor.infor_autograph
      this.portraitModifySrc = require('@/assets/img/' + this.userInfor.infor_portrait)
    },
    // 修改成功，更新数据
    modifySuccess () {
      this.isModifyShow = false
      this.userInfor.infor_name = this.nameModify
      this.userInfor.infor_email = this.emailModify
      this.userInfor.infor_phone = this.phoneModify
      this.userInfor.infor_autograph = this.autographModify
      this.userInfor.infor_portrait = this.portraitModifySrcName
      // 更新头像，同步用户名cookie和状态参数
      this.portraitSrc = require('@/assets/img/' + this.portraitModifySrcName)
      this.userName = this.nameModify
      this.setCookie('userName', this.userName, 7)
      this.$store.state.userName = this.userName
    },
    // 头像上传成功
    uploadSuccess (event, file, fileList) {
      this.portraitModifySrcName = file.name
      this.portraitModifySrc = require('@/assets/img/' + this.portraitModifySrcName)
    },
    // 发送请求，尝试保存个人信息修改
    saveModify () {
      this.$axios.post('/api/updateUserInfor', {
        userId: this.userId,
        userName: this.nameModify,
        userEmail: this.emailModify,
        userPhone: this.phoneModify,
        userPortrait: this.portraitModifySrcName,
        userAutograph: this.autographModify
      }).then(response => {
        console.log('修改用户信息')
        if (response.data === 'SUCCESS') {
          this.$Message.success('用户信息修改成功！')
          this.modifySuccess()
        } else {
          this.$Message.error('修改失败！请检查修改的信息（用户名或手机号可能重复）')
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('请求失败！' + error.status + ',' + error.statusText)
      })
    },
    // 退出登录
    logout () {
      this.clearCookie()
      this.$Message.success('退出成功！')
      this.isLogin = false
      this.userName = ''
      this.userId = ''
      this.setLoginState()
      this.reload()
    },
    // 从Vuex更新登录状态
    getLoginState () {
      this.isLogin = this.getCookie('isLogin')
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('userName')
    },
    // 退出登录后更新登录状态
    setLoginState () {
      this.$store.state.isLogin = this.isLogin
      this.$store.state.userId = this.userId
      this.$store.state.userName = this.userName
    },
    // 同步状态，读取用户信息
    syncUser () {
      // 获取基本信息
      this.$axios.post('/api/findByCondition', {
        name: this.userName
      }).then(data => {
        console.log('获取用户基本信息')
        this.userInfor = data.data
        // 更新头像
        this.portraitSrc = require('@/assets/img/' + this.userInfor.infor_portrait)
      })
      // 获取粉丝数量
      this.$axios.get('/api/getFansNumByCookie', {
        name: this.userName
      }).then(data => {
        this.fansNum = data.data
        console.log('获取粉丝数：' + this.fansNum)
      })
      // 获取关注数量
      this.$axios.get('/api/getUserNumByCookie', {
        name: this.userName
      }).then(data => {
        this.followNum = data.data
        console.log('获取关注数：' + this.followNum)
      })
    },
     // 设置cookie
    setCookie (cname, cvalue, exdays) {
      var d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
      var expires = 'expires=' + d.toUTCString()
      console.info(cname + '=' + cvalue + '; ' + expires)
      document.cookie = cname + '=' + cvalue + '; ' + expires
      console.info(document.cookie)
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
    // 清除登录cookie
    clearCookie () {
      this.setCookie('isLogin', '', -1)
      this.setCookie('userId', '', -1)
      this.setCookie('userName', '', -1)
    }
  },
  // 生命周期函数，打开页面后自动运行
  created () {
    this.getLoginState()
    if (this.isLogin) {
      this.syncUser()
    }
  }
}
</script>

<style scoped>
#app {
  position: relative;
  width: 100%;
  height: 52px;
  background: #ffffff;
  border-bottom: #dcdee2 1px solid;
}

.menu {
  text-decoration: none;
  color: #333;
  width: 100%;
  height: 100%;
}

.head {
  width: 68%;
  height: 100%;
  margin: 0 auto;
}

.head-title {
  position: relative;
  float: left;
  height: 100%;
  width: 90px;
  line-height: 52px;
  text-align: center;
  font-size: 32px;
  color: #2d8cf0;
}

.head-menu {
  position: relative;
  float: left;
  font-size: 16px;
  color: #3d3f42;
  text-align: center;
  height: 100%;
  width: 60px;
  line-height: 52px;
}

.search-bar {
  position: relative;
  float: left;
  width: 400px;
  left: 20px;
  margin: 10px 0 10px 0;
  background-color: #2d8cf0;
}

.search-input {
  position: absolute;
  left: 0;
  width: 330px;
}

.search-button {
  position: absolute;
  right: 0px;
}

.user-bar {
  float: right;
  height: 100%;
  width: 180px;
}

.head-icon1 {
  position: relative;
  float: left;
  margin-top: 14px;
  width: 60px;
  height: 100%;
}

.head-icon2 {
  position: relative;
  float: left;
  margin-top: 14px;
  width: 60px;
  height: 100%;
}

.user-portrait {
  float: right;
  right: 10px;
  top: -42px;
}

#userInfor,#userInforModify {
  width: 100%;
  height: 100%;
}

.user-head {
  width: 100%;
  height: 220px;
}

.user-protraitLarge {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  overflow: hidden;
}

.user-head button {
  position: relative;
  float: right;
  top: 68px;
}

.user-infor {
  position: relative;
  width: 100%;
  height: 120px;
}

.infor-name {
  width: 100%;
  font-size: 28px;
  color: #17233d;
}

/* 用户详细信息，粉丝、关注和主题数 */
.infor-detail {
  float: left;
  margin-top: 10px;
  width: 60px;
  color: #515a6e;
  font-size: 14px;
}

/* 用户头像 */
.infor-autograph {
  margin-top: 8px;
  float: left;
  width: 420px;
  font-size: 14px;
}

.user-detail {
  width: 100%;
  height: 300px;
}

.modify-head {
  width: 100%;
  height: 200px;
}

.upload {
  position: relative;
  float: right;
  top: 68px;
}

.modify-title {
  width: 100%;
  font-size: 16px;
  margin-top:20px;
}

.modify-input {
  width: 150px;
  margin-top:10px;
}
</style>
