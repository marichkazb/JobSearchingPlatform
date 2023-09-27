<template>
    <div>
    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://getbootstrap.com/docs/5.3/assets/css/docs.css" rel="stylesheet">
    </head>
    <body class="wrapper">
    <nav class="navbar navbar-expand-lg container">
  <div class="container-fluid">
    <a class="navbar-brand navText" href="/">Logo</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link navText" href="/jobListing">Job Listings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link navText" href="/profile">Profile</a>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
      </form>
      <p class="avatar">A</p>
    </div>
  </div>
</nav>
</body>
</div>
</template>

<script>

import { Api } from '@/Api'

export default {
  name: 'Navbar',
  data() {
    return {
      jobsData: 'none'
    }
  },
  methods: {
    getJobs() {
      Api.get('/v1/jobs')
        .then(response => {
          this.jobsData = response.data
          console.log(this.jobsData)
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style>
    .wrapper {
        background-color: rgba(7, 25, 82, 1);
        padding-left: 80px;
        position: sticky;
        top: 0;
        right: 0;
        z-index: 1000;
    }
    .container {
        background-color: rgba(7, 25, 82, 1);
        color: white !important;
        margin: 0 !important;
        height: 60px !important;

    }
    .navText {
        color: white !important;
    }
    .avatar {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background-color: rgb(202, 213, 247);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
    }
</style>
