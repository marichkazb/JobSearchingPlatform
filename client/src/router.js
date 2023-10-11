import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import JobDescription from './views/JobDescription'
import JobCreation from './views/JobCreation'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/job-description/:id',
      name: 'job-description',
      component: JobDescription
    },
    {
      path: '/job-creation',
      name: 'job-creation',
      component: JobCreation
    }
  ]
})
