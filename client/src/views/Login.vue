<!-- Login.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <div class="input-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="Email">
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="Password">
      </div>
      <button class="login-button" @click="login">Login</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseInit';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/dashboard');
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f8fc;
}

.login-box {
  width: 350px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #4285f4;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #357abf;
}

.error-message {
  margin-top: 10px;
  color: red;
}
</style>
