import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import JobListing from './views/JobListing.vue'
import Application from './views/Application.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue';
import SignUp from './views/SignUp.vue';
// import { auth } from '../firebaseInit';

Vue.use(VueRouter) // CHECK THIS

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/jobListing',
      name: 'jobListing',
      component: JobListing,
    },
    {
      path: '/application/:id',
      name: 'application',
      component: Application,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true, // Indicate that this route is only for guests (non-authenticated users)
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: {
        requiresAuth: true, // This route requires the user to be authenticated
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
      meta: {
        guest: true, // Indicate that this route is only for guests (non-authenticated users)
      },
    },
  ],
});

/*
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const onlyForGuests = to.matched.some((record) => record.meta.guest);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (onlyForGuests && isAuthenticated) {
    next('/'); // Redirect to home or some other route if an authenticated user tries to access 'guest' routes like /login
  } else {
    next();
  }
});
*/

export default router;
