<template>
  <div class="home">
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from '../../firebaseInit';

const uiConfig = {
  signInSuccessUrl: '#/loggedin',
  signInOptions: [
    { provider: EmailAuthProvider.PROVIDER_ID, requireDisplayName: false },
    GoogleAuthProvider.PROVIDER_ID,
  ],
  tosUrl: 'http://example.com',
  privacyPolicyUrl: 'http://example.com',
  // signInFlow: 'redirect',
  signInFlow: 'popup',
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      console.log('signInSuccessWithAuthResult:', authResult, redirectUrl);
      return true;
    },
    signInFailure: function (error) {
      console.log('signInFailure:', error);

      return error;
    },
    uiShown: function () {
      console.log('uiShown');
    },
  },
};
let fbUI = {};

export default {
  name: 'Home',
  data: function () {
    return {};
  },
  methods: {
    initFBUI: function () {
      const uiReference = firebaseui.auth.AuthUI.getInstance();
      console.log('uiReference ', uiReference);
      fbUI =
        uiReference !== null
          ? uiReference
          : new firebaseui.auth.AuthUI(auth);
      console.log('fbUI', fbUI);
    },
    startAuthUI: function () {
      console.log('ui.isPendingRedirect()', fbUI.isPendingRedirect());
      fbUI.start('#firebaseui-auth-container', uiConfig);
      console.log('fbUI started');
    },
  },
  mounted() {
    this.initFBUI();
    this.startAuthUI();
  },
};
</script>

<style scoped></style>
