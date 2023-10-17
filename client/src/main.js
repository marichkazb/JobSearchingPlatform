import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'

import { auth } from '../firebaseInit';
import { Api } from '@/Api';
import {
  getIdToken, refreshToken
} from '../authService';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

/*
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
*/

let app;

if (!app) {
  app = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      refreshToken();
      const token = await getIdToken();
      const response = await Api.get('/v1/getUserType', {
        headers: {
          Authorization: `${token}`,
        },
      });
      // refreshToken();
      localStorage.setItem('isUserLoggedIn', true);

      const data = response.data;
      const userType = data.userType;
      const currentRoutePath = router.currentRoute.path;

      if (userType === 'none') {
        if (router.currentRoute.path !== '/setRole') {
          router.push('/setRole');
        }
      } else if (
        currentRoutePath === '/login' ||
        currentRoutePath === '/signup' ||
        currentRoutePath === '/' ||
        currentRoutePath === '/setRole'
      ) {
        router.push('/jobListing');
        location.reload(true);
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  } else if (
    router.currentRoute.path !== '/' &&
    router.currentRoute.path !== '/login' &&
    router.currentRoute.path !== '/signup'
  ) {
    router.push('/');
  }
});
