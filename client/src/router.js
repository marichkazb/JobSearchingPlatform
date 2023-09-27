import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import JobListing from './views/JobListing.vue'
import Application from './views/Application.vue'

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
      path: '/jobListing',
      name: 'jobListing',
      component: JobListing
    },
    {
      path: '/application/:id',
      name: 'application',
      component: Application
    }
  ]
})
