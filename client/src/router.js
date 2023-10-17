import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import JobListing from './views/JobListing.vue';
import Application from './views/Application.vue';
import Login from './views/Login.vue';
import SignUp from './views/SignUp.vue';
import SetRole from './views/SetRole.vue';
import JobDescription from './views/JobDescription'
import JobCreation from './views/JobCreation'
import CompanyProfile from './views/CompanyProfile'
import JobApplications from '@/views/JobApplications.vue';

// import { auth } from '../firebaseInit';

Vue.use(VueRouter); // CHECK THIS

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
      meta: {
        guest: true, // Indicate that this route is only for guests (non-authenticated users)
      },
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
      path: '/signup',
      name: 'signup',
      component: SignUp,
      meta: {
        guest: true, // Indicate that this route is only for guests (non-authenticated users)
      },
    },
    {
      path: '/setRole',
      name: 'setRole',
      component: SetRole,
      meta: {
        requiresAuth: true, // This route requires the user to be authenticated
      },
    },
    {
      path: '/job-description/:id',
      name: 'job-description',
      component: JobDescription,
      meta: {
        requiresAuth: false, // This route requires the user to be authenticated
      },
    },
    {
      path: '/job-creation',
      name: 'job-creation',
      component: JobCreation,
      meta: {
        requiresAuth: true, // This route requires the user to be authenticated
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: CompanyProfile,
      meta: {
        requiresAuth: true, // This route requires the user to be authenticated
      },
    },
    {
      path: '/jobApplications/:id',
      name: 'jobApplications',
      component: JobApplications,
      meta: {
        requiresAuth: false, // This route requires the user to be authenticated
      },
    }
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
