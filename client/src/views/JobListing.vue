<template>
  <b-container fluid>
    <Alert :alertMessage="alertMessage" :alertId="alertId"/>
    <JobSearch @search="handleSearch"  class="mt-5"/>

    <b-row class="mt-3">
      <b-col>
        <h4 class="title">{{ title }}</h4>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col>
        <b-button v-if="canCreate" @click="postAJob()" variant="primary" class="borderlessBtn mr-2 mb-2">Create New</b-button>
        <b-button v-if="canDelete" @click="deleteAllJobs()" variant="danger" class="redBtn mb-2">Delete All</b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-col v-if="jobsData.length === 0" id="emptyState" class="m-5">
        <h4>{{ emptyStateDesc }}</h4>
        <b-button v-if="userType === 'company'" @click="postAJob()" variant="primary">Create your first job opening</b-button>
      </b-col>
      <b-col v-for="job in sortedJobs" :key="job._id" md="4" sm="6" xs="12">
        <b-card no-body class="jobWrapper m-2 mb-3">
          <b-row class="m-0 pl-2">
            <b-col xs="4" md="2" class="media-left p-2 mt-5">
              <b-img v-if="job.company_image" :src="job.company_image" alt="logo" id="companyImage" fluid/>
              <b-img v-else :src="defaultImage" alt="logo" id="companyImage" fluid/>
            </b-col>
            <b-col xs="8" md="10" class="p-2">
              <b-card-text class="text oneLine">{{job.company_name}}</b-card-text>
              <b-card-title class="text oneLine jobTitle">{{job.title}}</b-card-title>
              <b-card-text class="text threeLines desc">{{job.description}}</b-card-text>
              <b-card-text class="text oneLine">{{job.location}}</b-card-text>
              <b-card-text class="text oneLine">{{job.job_enrollment_status}}</b-card-text>

              <b-button-group class="buttonsContainer mt-3">
                <b-button @click="viewDetails(job)" class="applyBtn resizeBtn mr-2 mb-2" variant="primary">Details</b-button>
                <b-button v-if="canApply" @click="handleClick(job)" class="applyBtn resizeBtn mr-2 mb-2" variant="primary">Apply</b-button>
                <b-button v-if="canDelete" @click="deleteJob(job); $event.stopPropagation()" class="redBtn resizeBtn mb-2" variant="danger">Delete</b-button>
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

const defaultImage = require('../assets/defaultCompanyLogo.png')

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
      if (this.userType === 'admin' || this.userType === 'company') {
        return this.jobsData.length !== 0
      } else return false
    },
    canCreate() {
      if (this.userType === 'admin' || this.userType === 'company') {
        return true;
      } else return false
    },
    canApply() {
      if (this.userType === 'admin' || this.userType === 'candidate') {
        return true;
      } else return false
    },
    title() {
      switch (this.userType) {
        case 'company':
          return 'My job openings💻';
        case 'admin':
          return 'All job openings👨‍💻';
        default:
          return 'Trending now🔥';
      }
    },
    emptyStateDesc() {
      switch (this.userType) {
        case 'company':
          return 'You have not posted any job openings yet. Create a fresh job advertisement to enroll more talented workers!';
        case 'admin':
          return 'No job openings were posted yet.';
        default:
          return 'There are no job openings at the moment. Stay tuned to get to know about the job of your dream first. 💪';
      }
    },
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
      alertMessage: 'Test1',
      showAlert: false,
      alertId: undefined,
      searchTerm: '',
      userType: 'user',
      companyId: '',
      defaultImage
    }
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserType()
      }
      console.log(this.jobsData)
    });
  },
  methods: {
    async getJobs(userType) {
      const token = await getIdToken();
      console.log(this.userType)
      if (userType === 'company') {
        Api.get(`/v1/companies/${this.companyId}/jobs`, {
          headers: {
            Authorization: `${token}`
          }
        })
          .then(response => {
            console.log(response);
            this.jobsData = response.data
            console.log(this.jobsData)
          })
          .catch(error => {
            this.message = error
          })
      } else {
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
      }
    },
    handleClick(job) {
      this.$router.push(`/application/${job._id}`)
    },
    postAJob() {
      this.$router.push('/job-creation')
    },
    viewDetails(job) {
      this.$router.push(`/job-description/${job._id}`)
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
    async createJob() {
      this.$router.push({ path: '/job-creation' });
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
          this.companyId = response.data.companyId
          this.getJobs(this.userType)
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

.oneLine {
    /* Ensures no more than 1 line. Truncates if more.*/
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.threeLines {
  /* Ensures no more than 3 lines. Truncates if more.*/
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

}
.threeLines::after {
  /* Ensures at least 3 lines by adding empty lines (that will get truncated if not needed)*/
  content: " \A \A \A"; /* Generates three lines */
  white-space: pre-wrap; /* Respects newlines and white spaces */
  visibility: hidden; /* Hides the content but takes up space */
  display: block; /* Ensure it's block-level */
}
.desc {
  color: rgb(0, 0, 0);
  font-weight: 300;

}

.borderlessBtn {
  border: none;
}
.redBtn {
  background-color: rgb(229, 182, 182);
  border: none;
}

.applyBtn {
  border: none;
  background-color:rgba(7, 25, 82, 1);
}

.resizeBtn {
  flex: 1 0 calc(30%);
}
.buttonsContainer {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 24px;
  flex-wrap: wrap; /* allows the buttons to wrap to next line */
}
#emptyState {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 40rem;
  margin-top: 30px;
  text-align: left;
}
#companyImage {
  width: 60px;
  height: 60px;
}
</style>
