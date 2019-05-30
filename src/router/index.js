import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import Index from '@/views/forum/index'
import ForumCenter from '@/views/forum/pages/ForumCenter'
import CollegeDetail from '@/views/forum/pages/CollegeDetail'
import TopicDetail from '@/views/forum/pages/TopicDetail'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'test',
      component: Login,
      meta: {
        title: '默认的主页面'
      }
    }, {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    }, {
        path: '/forum',
        name: 'Forum',
        component: Index,
        // 重定向到另一个页面
        redirect: '/forumCenter',
        children: [
        {
          path: '/forumCenter',
          component: ForumCenter
        }, {
          path: '/collegeDetail',
          component: CollegeDetail
        }, {
          path: '/topicDetail',
          component: TopicDetail
        }]
    }
  ]
})
