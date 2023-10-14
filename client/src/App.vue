<template>
  <div id="app">
    <Navbar v-if="isUserLoggedIn" />
    <!-- Render the content of the current page view -->
    <b-container fluid class="p-0">
      <router-view />
    </b-container>
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,500;0,600;1,100&family=Raleway:wght@100;400;700&display=swap');
#app {
  font-family: 'Raleway', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  overflow: auto;
}
.title {
  font-size: 32px;
  font-weight: 800;
  margin-left: 18px;
}
:root {
    --navbar-height: 0px; /* This is a default/fallback value */
}
</style>
