<template>
  <b-container fluid class="homeContainer">
    <b-row class="homeWrapper justify-content-between h-100 mr-3 ml-3">
      <b-col md="4" class="text-left d-flex flex-column justify-content-start mt-5">
        <p class="introText dreamJob">Your Dream Job</p>
      </b-col>

      <b-col md="4" class="text-center d-flex flex-column justify-content-center">
        <img :src="image" class="img-fluid">
      </b-col>

      <b-col md="4" class="text-right d-flex flex-column justify-content-end mb-5">
        <p class="introText startsHere">Starts here.</p>
        <div>
          <b-button @click="login()" class="btnLogin mr-3" variant="outline-primary">Login</b-button>
          <b-button @click="signUp()" class="btnLogin" variant="primary">Sign Up</b-button>
        </div>
      </b-col>

    </b-row>
  </b-container>
</template>

<script>
const image = require('../assets/homeIcon.svg');

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

<style scoped>
@media (max-width: 767px) {
  .introText {
    font-size: 2rem;
  }
  .btnLogin {
    font-size: 1.2rem !important;
  }
  .img-fluid {
    max-height: 33.33vh;
  }
}
.homeContainer {
  background-color: rgba(7, 25, 82, 1);
  height: 100vh;
  overflow: auto;
}

.introText {
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.btnLogin {
  color: white !important;
  font-size: 1.5rem !important;
  border-radius: 50px !important;
  font-weight: 500 !important;
  padding: 10px 20px !important;
}

.img-fluid {
    height: 70vh;
}

</style>
