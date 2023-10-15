<template>
  <b-container fluid class="alignCenter">
    <b-row class="justify-content-center">
      <b-col cols="12" md="8" lg="6">
        <h2 class="text-center">Sign Up</h2>
        <div id="firebaseui-auth-container"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { auth } from '../../firebaseInit';
import * as firebaseui from 'firebaseui';
import { EmailAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

let ui = {};

export default {
  name: 'SignUp',
  mounted() {
    const uiConfig = {
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
