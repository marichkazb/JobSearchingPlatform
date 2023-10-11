<template>
  <div class="homeWrapper">
      <p class="introText dreamJob">Your Dream Job</p>
      <img :src="image" class="img">
      <p class="introText startsHere">Starts here.</p>
      <div class="buttonsWrapper">
        <b-button @click="login()" class="btnLogin" variant="outlined">Login</b-button>
        <b-button @click="signUp()" class="btnLogin" variant="primary">Sign Up</b-button>
      </div>
  </div>
</template>

<script>
const image = require('../assets/homeIcon.svg')

export default {
  name: 'home',
  data() {
    return {
      message: 'none',
      image
    };
  },
  methods: {
    login() {
      this.$router.push('/login');
    },
    signUp() {
      this.$router.push('/signup');
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
.img {
  position: absolute;
  top: 100px;
  right: 30em
}
.homeWrapper {
  background-color: rgba(7, 25, 82, 1);
  height: 100rem;
}
.introText {
  position: absolute;
  font-size: 64px;
  font-weight: bold;
  color: white;
}
.dreamJob {
  top: 10rem;
  left: 5rem;
  width: 400px
}
.startsHere {
  top: 28rem;
  right: 5rem
}
.buttonsWrapper {
  position: absolute;
  bottom: 7rem;
  right: 5rem;
}
.btnLogin {
  color: white !important;
  font-size: 24px !important;
  border-radius: 50px !important;
  font-weight: 500 !important;
}
</style>
