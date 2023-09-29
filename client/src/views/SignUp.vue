<template>
  <div>
    <h2>Sign Up</h2>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import { auth } from '../../firebaseInit';
import * as firebaseui from 'firebaseui';
import { EmailAuthProvider } from 'firebase/auth'; // GoogleAuthProvider

let ui = {};

export default {
  name: 'SignUp',
  mounted() {
    const uiConfig = {
      signInSuccessUrl: '/dashboard', // Redirect to dashboard or some other page after sign-up
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID
      ],
    };
    ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);
  }
};
</script>
