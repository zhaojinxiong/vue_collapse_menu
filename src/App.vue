<template>
  <div id="app">
    <collapse-menu></collapse-menu>
  </div>
</template>

<script>
import collapseMenu from './menu.vue'
export default {
  name: 'app',
  components:{
    collapseMenu
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>

</style>
