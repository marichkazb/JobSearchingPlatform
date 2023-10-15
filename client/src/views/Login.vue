<template>
  <b-container fluid class="login-container">
    <b-row class="justify-content-center align-items-center min-vh-100">
      <b-col cols="8" md="6" lg="5" xl="4" xxl="3">
        <Alert :alertMessage="alertMessage" :alertId="alertId" :getVariant="alertVariant" />
        <b-card>
          <b-card-title class="text-center">Login</b-card-title>

          <b-form @submit.prevent="login">
            <b-form-group id="emailGroup" label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="Enter email"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="passwordGroup" label="Password" label-for="password">
              <b-input-group>
                <b-form-input
                  :type="passwordVisible ? 'text' : 'password'"
                  v-model="password"
                  required
                  placeholder="Enter password"
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-secondary" @click="togglePasswordVisibility">
                    {{ passwordVisible ? 'Hide' : 'Show' }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-button variant="primary" type="submit" block :disabled="isLoading">
              <b-spinner small v-if="isLoading" class="mr-2"></b-spinner>
              <span v-if="isLoading">Logging in...</span>
              <span v-else>Login</span>
            </b-button>

            <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

            <p class="text-center mt-3">
              Don't have an account? <b-link :to="{ path: '/signup' }">Sign Up</b-link>
            </p>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { login } from '../../authService';
import Alert from '../components/Alert.vue'; // Please update the path accordingly
import { BContainer, BRow, BCol, BCard, BCardTitle, BForm, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BButton, BSpinner, BLink } from 'bootstrap-vue';

export default {
  components: {
    Alert,
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardTitle,
    BForm,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    BButton,
    BSpinner,
    BLink
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
</style>
