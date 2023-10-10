<template>
  <div class="pageWrapper alignCenter">
    <h2>Sign Up</h2>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import { auth } from '../../firebaseInit';
import * as firebaseui from 'firebaseui';
import { EmailAuthProvider } from 'firebase/auth'; // GoogleAuthProvider
import 'firebaseui/dist/firebaseui.css';

let ui = {};

export default {
  name: 'SignUp',
  mounted() {
    const uiConfig = {
      // signInSuccessUrl: '/setRole', // Redirect to dashboard or some other page after sign-up
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID
      ],
    };
    ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);
  }
};
</script>

<style scoped>
.alignCenter {
  margin-top: 10rem;
}
</style>
