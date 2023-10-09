<template>
  <b-container fluid>
    <Alert :alertMessage="alertMessage" :alertId="alertId"/>
    <JobSearch @search="handleSearch"  class="mt-3"/>

    <b-row class="mt-3">
      <b-col>
        <h4 class="title">Trending now🔥</h4>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col>
        <b-button v-if="canDelete" @click="deleteAllJobs()" variant="danger" class="redBtn mb-2">Delete all!!</b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-col v-for="job in sortedJobs" :key="job._id" md="4" sm="6" xs="12">
        <b-card no-body class="jobWrapper mb-3">
          <b-row class="m-0">
            <b-col xs="4" md="2" class="media-left p-2">
              <b-img :src="image" fluid></b-img>
            </b-col>
            <b-col xs="8" md="10" class="p-2">
              <b-card-text class="text">{{job.company_name}}</b-card-text>
              <b-card-title class="text jobTitle">{{job.title}}</b-card-title>
              <b-card-text class="text desc">{{job.description}}</b-card-text>
              <b-card-text class="text">{{job.location}}</b-card-text>
              <b-card-text class="text">{{job.job_enrollment_status}}</b-card-text>

              <b-button-group class="buttonsContainer mt-3">
                <b-button @click="handleClick(job)" class="applyBtn mr-2" variant="primary">Apply</b-button>
                <b-button v-if="canDelete" @click="deleteJob(job); $event.stopPropagation()" class="redBtn" variant="danger">Delete</b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import { Api } from '@/Api'
import Alert from '../components/Alert'
import { getIdToken } from '../../authService';
import { auth } from '../../firebaseInit';
import JobSearch from '../components/JobSearch'

const image = require('../assets/jobIcon.png')

export default {
  components: {
    Alert,
    JobSearch
  },
  computed: {
    sortedJobs() {
      if (this.searchTerm) {
        return this.jobsData.filter(job => {
          for (const key in job) {
            if (
              job[key].toString().toLowerCase().includes(this.searchTerm.toLowerCase())
            ) {
              return true;
            }
          }
          return false;
        });
      } else return this.jobsData;
    },
    canDelete() {
      console.log(this.userType)
      if (this.userType === 'admin' || this.userType === 'company') {
        return true
      } else return false
    }
  },
  watch: {
    searchTerm() {
      console.log('Updated');
    },
  },
  name: 'JobListing',
  data() {
    return {
      jobsData: this.getJobs,
      image,
      alertMessage: 'Test1',
      showAlert: false,
      alertId: undefined,
      searchTerm: '',
      userType: 'user'
    }
  },
  async created() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.jobsData = await this.getJobs();
      }
    });
  },
  updated() {
    this.getUserType()
  },
  methods: {
    async getJobs() {
      const token = await getIdToken();
      Api.get('/v1/jobs', {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          this.jobsData = response.data
          console.log(this.jobsData)
        })
        .catch(error => {
          this.message = error
        })
    },
    handleClick(job) {
      this.$router.push(`/application/${job._id}`)
    },
    handleSearch(searchTerm) {
      this.searchTerm = searchTerm;
    },
    async deleteJob(job) {
      this.alertMessage = `Successfully deleted a job ${job.title}`
      this.alertId = job._id
      const token = await getIdToken();
      Api.delete(`/v1/jobs/${job._id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          this.jobsData = this.jobsData.filter(item => item._id !== job._id)
        })
        .catch(error => {
          this.message = error
        })
    },
    async deleteAllJobs() {
      this.alertMessage = 'Successfully deleted all jobs'
      this.alertId = Math.random()
      const token = await getIdToken();
      Api.delete('v1/jobs', {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          this.jobsData = []
        })
        .catch(error => {
          this.message = error
        })
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
  }
}
</script>

<style scoped>
.jobWrapper {
  border-radius: 10px;
  transition: all 0.3s;
}

.jobWrapper:hover {
  border-color: rgb(202, 213, 247);
  box-shadow: 0 0 5px rgb(202, 213, 247);
}

.text {
  margin: 0;
  text-align: left;
}

.jobTitle {
  font-weight: 600;
  font-size: 1.5rem; /* Adjusts with screen size */
}

.desc {
  color: rgb(0, 0, 0);
  font-weight: 300;
}

.redBtn {
  background-color: rgb(229, 182, 182);
  border: none;
}

.applyBtn {
  border: none;
  background-color:rgba(7, 25, 82, 1);
}
</style>
