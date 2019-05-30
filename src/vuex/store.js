import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    isLogin: false,
    userName: '',
    userId: '',
    collegeId: '',
    topicId: ''
  },
  mutations: {
    setCollegeId (state, collegeId) {
        state.collegeId = collegeId
        sessionStorage.setItem('collegeId', collegeId)
    },
    setTopicId (state, topicId) {
      state.topicId = topicId
      sessionStorage.setItem('topicId', topicId)
    }
  },
  actions: {

  },
  getters: {
    collegeId: (state) => sessionStorage.getItem('collegeId'),
    topicId: (state) => sessionStorage.getItem('topicId')
  }
})

export default store
