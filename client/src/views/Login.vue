<!-- Login.vue -->
<template>
  <div class="login-container">
        <Alert :alertMessage="alertMessage" :alertId="alertId" :getVariant="alertVariant" />
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
import { login } from '../../authService';
import Alert from '../components/Alert.vue'; // Please update the path accordingly

export default {
  components: {
    Alert,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
      passwordVisible: false,
      alertMessage: undefined,
      alertId: undefined,
      alertVariant: undefined,
    };
  },
  methods: {
    getFriendlyMessage(errorCode) {
      const errorMessages = {
        'auth/invalid-login-credentials': 'These login credentials are invalid. Please review them or register as a new user.',
        'auth/user-not-found': 'There is no user record corresponding to this email. Please check the email address or register as a new user.',
        'auth/wrong-password': 'The password you entered is incorrect. Please try again or use the "Forgot password" option to reset your password.',
        'auth/user-disabled': 'Your account has been disabled by an administrator. Please contact support for assistance.',
        'auth/email-already-in-use': 'The email address is already in use by another account. Please use a different email address.',
        'auth/operation-not-allowed': 'This type of account is not enabled. Please contact support for assistance.',
        'auth/invalid-email': 'The email address is not valid. Please enter a valid email address.',
        'auth/weak-password': 'The password is too weak. Please enter a stronger password with a minimum of 6 characters.',
        'auth/network-request-failed': 'A network error has occurred. Please check your internet connection and try again.',
        'auth/too-many-requests': 'We have detected too many requests from your device. Please take a break and try again later.',
        'auth/requires-recent-login': 'This operation is sensitive and requires recent authentication. Please log in again before retrying this request.',
        'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.',
        'auth/provider-already-linked': 'You have already linked this account with the given provider.',
        'auth/credential-already-in-use': 'The credentials are already in use by another user.',
        'auth/invalid-credential': 'The credential is malformed or has expired. Please try again with valid credentials.',
      };

      // If the error code exists in the mapping, using the friendly message, otherwise using a general error message.
      return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
    },
    async login() {
      this.isLoading = true;
      try {
        await login(this.email, this.password);
      } catch (error) {
        this.alertMessage = this.getFriendlyMessage(error.code)
        this.alertVariant = 'danger'
        this.alertId = Math.random()
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
