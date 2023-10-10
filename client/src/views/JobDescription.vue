<template>
     <div>
    <div class="container mt-4">
    <div class="row">
      <div class="col-md-6 custom-left-align">
        <div>
          <h2>{{job.title}}</h2>
          <div class="d-flex align-items-center">
          <h5 class="mr-3">at {{job.company_name}}</h5>
          <h5 class="mr-3 job-enrollment-badge mr-2 mb-2">{{job.job_enrollment_status}}</h5>
          <h5 v-if="job.validation" class="custom-alert alert-success rounded">Validated</h5>
          <p v-else class="custom-alert alert-danger rounded">Not Validated</p>
        </div>
        </div>
        <div class="mb-4">
          <h1>Description</h1>
          <p>{{job.description}}</p>
        </div>
        <div>
          <h1>Skills</h1>
          <span
          v-for="skill in job.skills" :key="skill" class="custom-badge mr-2 mb-2">
          {{ skill }}
        </span>
        </div>
      </div>
      <div class="col-md-6">
        <div class="float-right">
        <b-button href="#" size="lg" class="applyBtn mb-4">Apply</b-button>
        </div>
<div class="card text-white box col-md-12 rounded mb-4">
<div class="row">
  <div class="col-md-6 d-flex flex-column h-100 justify-content-center align-items-center">
    <h5 class="card-title">Salary (USD)</h5>
    <h4 class="salary">${{job.yearly_salary_min}} - ${{job.yearly_salary_max}}</h4>
    <h5>Yearly Salary</h5>
  </div>
  <div class="col-md-6">
    <h5 class="card-title">Job Location</h5>
    <p class="card-text">{{job.location}}</p>
  </div>
</div>
</div>
        <div class="row">
  <div class="col-sm-12 mb-3 mb-sm-0">
    <div class="card custom-blue-border">
      <div class="card-body">
        <h5 class="card-title text-left">Job Overview</h5>
        <div class="row">
        <div class="col-md-4 mb-2">
        <p class="card-title text-left">JOB POSTED</p>
        <p class="card-text text-left mb-4" style="font-weight: bold;">{{ formatDate(job.date_posted) }}</p>
        </div>
        <div class="col-md-4 mb-2">
        <p class="card-title text-left">JOB EXPIRES IN</p>
        <p class="card-text text-left" style="font-weight: bold;">{{formatDate(job.deadline)}}</p>
        </div>
        <div class="col-md-4 mb-2">
        <p class="card-title text-left">JOB LEVEL</p>
        <p class="card-text text-left" style="font-weight: bold;">{{job.job_level}}</p>
        </div>
        <div class="col-md-4 mb-2">
        <p class="card-title text-left">JOB STATUS</p>
        <p class="card-text text-left" style="font-weight: bold;">{{job.job_enrollment_status}}</p>
        </div>
        <div class="col-md-4 mb-2">
          <p class="card-title text-left">EDUCATION</p>
        <p class="card-text text-left" style="font-weight: bold;">{{job.education_level}}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'JobDescription',
  data() {
    return {
      job: {}
    }
  },
  created() {
    this.fetchJob()
  },
  methods: {
    fetchJob() {
      const jobId = this.$route.params.id
      Api.get(`/v1/jobs/${jobId}`)
        .then(response => {
          this.job = response.data
          console.log(this.job)
        })
        .catch(error => {
          this.message = error.response.data
        })
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, options)
    }
  }
}
</script>

<style scoped>
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
  border: 2px solid rgb(7, 25, 82, 1);
}
.salary{
  color: aquamarine;
}
.box{
  background-color:rgba(7, 25, 82, 1);
  height: 150px;
}
.vertical-divider {
  border-left: 2px solid white;
  height: 100%;
  margin: 0 auto;
  padding: 0;
}
.custom-alert {
  width: 110px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.custom-badge{
  background-color: #ccc;
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
