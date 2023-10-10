import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import JobDescription from './views/JobDescription'

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
    }
  ]
})
