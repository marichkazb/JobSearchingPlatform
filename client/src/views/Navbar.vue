<template>
  <div>
    <head>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://getbootstrap.com/docs/5.3/assets/css/docs.css"
        rel="stylesheet"
      />
    </head>
    <body class="wrapper">
      <nav class="navbar navbar-expand-lg container">
        <div class="container-fluid">
          <a class="navbar-brand navText" href="/" v-if="!isUserLoggedIn">Logo</a>
          <a class="navbar-brand navText" href="/jobListing" v-else>Logo2</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link navText" href="/jobListing">Job Listings</a>
              </li>
              <!-- Only show if user is logged in -->
              <li class="nav-item" v-if="user">
                <a class="nav-link navText" href="/profile">Profile</a>
              </li>
              <!-- Only show if user is logged out -->
              <!--li class="nav-item" v-if="!user">
                <a class="nav-link navText" href="/login">Login</a>
              </li-->
            </ul>
            <form class="d-flex" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </form>
          <button class="avatar-btn" v-if="user" @click="logout">
  <span class="avatar-text">{{ user.displayName ? user.displayName[0] : 'A' }}</span>
</button>
          </div>
        </div>
      </nav>
    </body>
  </div>
</template>

<script>
import { Api } from '@/Api';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logout } from '../../authService';

export default {
  name: 'Navbar',
  data() {
    return {
      user: null,
      jobsData: 'none',
      logout,
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        this.user = currentUser;
      } else {
        this.user = null;
      }
    });
  },
  computed: {
    isUserLoggedIn() {
      return localStorage.getItem('isUserLoggedIn'); // Replace with your actual logic
    },
  },
  watch: {
    isUserLoggedIn() {
      console.log('Updated');
    },
  },
  methods: {
    getJobs() {
      Api.get('/v1/jobs')
        .then((response) => {
          this.jobsData = response.data;
          console.log(this.jobsData);
        })
        .catch((error) => {
          this.message = error;
        });
    },
    onDropdownShown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
  },
};
</script>

<style>

.wrapper {
  background-color: rgba(7, 25, 82, 1);
  padding-left: 80px;
  position: sticky;
  top: 0;
  right: 0;
  z-index: 1000;
  font-family: 'Raleway', 'Avenir', Helvetica, Arial, sans-serif;
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
.avatar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Makes it circular */
  background-color: #007BFF; /* A shade of blue; change as desired */
  color: white; /* Text color */
  border: none; /* Removes border */
  cursor: pointer; /* Hand cursor on hover */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  transition: background-color 0.3s;
}

.avatar-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.avatar-text {
  user-select: none; /* Prevents the text from being selectable */
}
</style>
