<template>
  <div id="app">
    <Navbar />
    <div id="nav">
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script>
import Navbar from './views/Navbar.vue'
export default {
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  margin: 32px;
}
.title {
    font-size: 32px;
    font-weight: 800;
    align-self: flex-start;
    margin-left: 18px;
}
</style>
