<template>
     <div>
    <div class="row">
      <div class="col-md-6 custom-left-align left-container">
        <div class="company-info mb-4">
        <div class="row">
          <div class="col md-2">
        <b-img :src="job.company_image" alt="logo" id="companyImage" fluid class="company-logo"/>
        </div>
        <div class="col-md-10">
         <h2 style="margin-left: 10px">{{job.title}}</h2>
         <h4 class="mr-3 text-muted" style="padding-left: 10px">at {{job.company_name}}</h4>
      </div>
      </div>
      </div>
        <div class="mb-4">
          <h2 class="mb-2">Description</h2>
          <p>{{job.description}}</p>
        </div>
        <div>
          <h2 class="mb-2">Skills</h2>
          <span
          v-for="skill in job.skills" :key="skill" class="custom-badge mr-2 mb-4">
          {{ skill }}
        </span>
        </div>
        <div>
      <h2 class="mb-2">Details</h2>
      <div>
          <div class="d-flex align-items-center">
          <h5 class="mr-3 job-enrollment-badge mr-2 mb-2">{{job.job_enrollment_status}}</h5>
          <h5 v-if="job.validation" class="custom-alert alert-success rounded">Validated</h5>
          <p v-else class="custom-alert alert-danger rounded">Not Validated</p>
        </div>
      </div>
    </div>
      </div>
      <div class="col-md-6 right-container">
        <div class="row">
  <div class="col-sm-6">
    <div class="card mb-4">
      <div class="card-body box text-white rounded">
        <h5 class="card-title">Salary</h5>
        <h4 class="text-colour">${{job.yearly_salary_min}} - ${{job.yearly_salary_max}}</h4>
        <h5 class="text-muted">USD</h5>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card mb-4">
      <div class="card-body box text-white rounded">
        <h5 class="card-title">Job Location</h5>
        <h4 class="card-text text-colour">{{job.location}}</h4>
        <h5 class="text-muted">Headquarters</h5>
      </div>
    </div>
  </div>
        </div>
        <div class="row">
  <div class="col-sm-12 mb-3 mb-4">
    <div class="card custom-blue-border">
      <div class="card-body">
        <h5 class="card-title text-left">Job Overview</h5>
        <div class="row">
        <div class="col-md-4 mb-2">
        <p class="card-title text-left text-muted">JOB POSTED</p>
        <p class="card-text text-left mb-4" style="font-weight: bold;">{{ formatDate(job.date_posted) }}</p>
        </div>
        <div class="col-md-4 mb-2">
        <p class="card-title text-left text-muted">JOB EXPIRES IN</p>
        <p class="card-text text-left" style="font-weight: bold;">{{formatDate(job.deadline)}}</p>
        </div>
        <div class="col-md-4 mb-2">
        <p class="card-title text-left text-muted">JOB LEVEL</p>
        <p class="card-text text-left" style="font-weight: bold;">{{job.job_level}}</p>
        </div>
        <div class="col-md-4 mb-2">
        <p class="card-title text-left text-muted">JOB STATUS</p>
        <p class="card-text text-left" style="font-weight: bold;">{{job.job_enrollment_status}}</p>
        </div>
        <div class="col-md-4 mb-2">
          <p class="card-title text-left text-muted">EDUCATION</p>
        <p class="card-text text-left" style="font-weight: bold;">{{job.education_level}}</p>
        </div>
      </div>
    </div>
    </div>
  </div>

        <div class="col-md-12 mt-4">
          <b-button v-if="isCandidate" @click="apply()" href="#" size="lg" class="applyBtn mb-4" variant="primary">Apply</b-button>
          <b-button v-else @click="viewApplications()" href="#" size="lg" class="applyBtn mb-4" variant="primary">View Applications</b-button>
        </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>

import { Api } from '@/Api'
import { getIdToken } from '../../authService';
import { auth } from '../../firebaseInit';

export default {
  name: 'JobDescription',
  data() {
    return {
      job: {},
      userType: ''
    }
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserType()
      }
    });
  },
  computed: {
    isCandidate() {
      return this.userType === 'candidate'
    }
  },
  methods: {
    async fetchJob() {
      const jobId = this.$route.params.id
      const token = await getIdToken();
      Api.get(`/v1/jobs/${jobId}`, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          this.job = response.data
        })
        .catch(error => {
          this.message = error.response.data
        })
    },
    apply() {
      this.$router.push(`/application/${this.$route.params.id}`)
    },
    viewApplications() {
      this.$router.push(`/jobApplications/${this.$route.params.id}`)
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, options)
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
          this.fetchJob()
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style scoped>
.left-container{
  padding: 80px;
}
.right-container{
  padding: 70px;
}
.company-logo{
  width: 500px;
}
.company-info{
  display: flex;
  align-items: center;
}
.input {
    margin: 16px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.02);
}
.custom-left-align {
  text-align: left;
}
.motivation {
    height: 100px;
}
.inputContainer {
    width: 50%
}
.applyBtn {
    background-color:rgba(7, 25, 82, 1);
    width: 248px;
    height: 56px;
}
.custom-blue-border{
  border: 2px solid rgb(11, 63, 234);
}
.text-colour{
  color: aquamarine;
}
.box{
  background-color:rgba(7, 25, 82, 1);
  height: 150px;
}
.custom-alert {
  width: 110px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.custom-badge{
  background-color: rgb(215, 212, 243);;
  color: #333;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 20px;
  display: inline-block;
}
.job-enrollment-badge{
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  width: 110px;
  height: 40px;
  display:flex;
  justify-content: center;
  align-items: center;
}
</style>
