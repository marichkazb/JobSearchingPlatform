<template>
  <div class="wrapper">
    <b-navbar toggleable="lg" type="dark" class="custom-navbar">
      <b-container fluid>
        <b-navbar-brand v-if="!isUserLoggedIn" href="/">Logo</b-navbar-brand>
        <b-navbar-brand v-else href="/jobListing">Logo2</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/jobListing">Job Listings</b-nav-item>
            <b-nav-item v-if="user" href="/profile">Profile</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text class="userRole">{{ capitalizedUserType }}</b-nav-text>
            <b-button v-if="user" @click="logout" class="avatar-btn">
              <span class="avatar-text">{{ user.displayName ? user.displayName[0] : 'A' }}</span>
            </b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
import { Api } from '@/Api';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logout, getIdToken } from '../../authService';

export default {
  name: 'Navbar',
  data() {
    return {
      user: null,
      jobsData: 'none',
      logout,
      userType: ''
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
      return localStorage.getItem('isUserLoggedIn');
    },
    capitalizedUserType() {
      return this.userType.charAt(0).toUpperCase() + this.userType.slice(1);
    },
  },
  watch: {
    isUserLoggedIn() {
      console.log('Updated');
    },
  },
  updated() {
    this.getUserType()
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
    async getUserType() {
      const token = await getIdToken();
      Api.get('/v1/getUserType', {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          this.userType = response.data.userType
          localStorage.setItem('userType', this.userType);
        })
        .catch(error => {
          this.message = error
        })
    }
  },
};
</script>

<style>

.custom-navbar {
  background-color: rgba(7, 25, 82, 1);
  position: sticky;
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
.userRole {
  margin-right: 15px
}
</style>
