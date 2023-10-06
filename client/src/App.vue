<template>
  <div id="app">
    <Navbar v-if="isUserLoggedIn" />
    <div id="nav">
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: {
    Navbar
  },
  computed: {
    isUserLoggedIn() {
      return localStorage.getItem('isUserLoggedIn'); // Replace with your actual logic
    },
  },
  watch: {
    isUserLoggedIn() {
      console.log('Updated');
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,500;0,600;1,100&family=Raleway:wght@100;400;700&display=swap');#app {
  font-family: 'Raleway', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  height: 100vh;
}
#nav {
  margin: 0px;
}
#app {
  overflow: auto;
}
.title {
    font-size: 32px;
    font-weight: 800;
    align-self: flex-start;
    margin-left: 18px;
}
.pageWrapper {
    margin: 56px;
    margin-left: 78px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}
</style>
