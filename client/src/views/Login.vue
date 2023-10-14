<!-- Login.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <div class="input-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="Email" />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input
          :type="passwordVisible ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
        />
        <button class="toggle-password" @click="togglePasswordVisibility">
          {{ passwordVisible ? "Hide" : "Show" }}
        </button>
      </div>
      <button class="login-button" @click="login" :disabled="isLoading">
        <span v-if="isLoading">Logging in...</span>
        <span v-else>Login</span>
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="signup-link">
        Don't have an account? <router-link to="/signup">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from '../../authService'; //, getClaims

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
      passwordVisible: false,
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        await login(this.email, this.password);

        /* const claims = await getClaims();
        if (claims && claims.role) {
          this.$router.push('/jobListing');
        } else {
          this.$router.push('/setRole');
        } */
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
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
  width: 450px;
  height: 400px;
  padding: 50px;
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

.signup-link {
  margin-top: 20px;
  font-size: 14px;
}

.signup-link a {
  color: #4285f4;
  text-decoration: none;
  transition: color 0.3s;
}

.signup-link a:hover {
  color: #357abf;
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 68%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #4285f4;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #357abf;
  font-weight: bold;
}
input[type="email"] {
  border: 1px solid #ccc;
}
</style>
