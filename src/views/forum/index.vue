<template>
  <div id='app'>
    <ForumHeader />
    <router-view />
    <ForumFooter />
  </div>
</template>

<script>
// 引入组件
import ForumHeader from '../forum/pages/ForumHeader'
import ForumFooter from '../forum/pages/ForumFooter'
export default {
  name: 'forum',
  data () {
    return {

    }
  },
  methods: {

  },
  components: {
    ForumHeader,
    ForumFooter
  }

}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}

#app {
  width: 1518px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f8f8f9;
}

</style>
