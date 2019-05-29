<template>
  <div id='app'>
    <div class='bottom-title'>
      <p>Copyright©2019 Lynn</p>
    </div>
  </div>
</template>

<script>
// 固定写法，参数的赋值
export default {
  name: 'forumFooter',
  data () {
    return {

    }
  },
  // 一些页面交互相关方法
  methods: {

  },
  // 生命周期函数，打开页面后自动运行
  created () {

  }
}
</script>

<style scoped>
#app {
  position: relative;
  width: 100%;
  height: 52px;
  background: white;
}

.bottom-title {
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 52px;
  margin: 0 auto;
  text-align: center;
  color: #515a6e;
  font-size: 14px;
}
</style>
