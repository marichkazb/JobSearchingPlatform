<template>
    <div class="pageWrapper">
        <p class="title">Trending now🔥</p>
        <b-button @click="deleteAllJobs()" variant="danger" class="applyBtn redBtn">Delete all!!</b-button>
        <div class="content">
          <div
              v-for="job in jobsData"
              :key="job._id"
              @click="handleClick(job)"
              class="hover">
              <div class="jobWrapper">
                <div class="media-left">
                  <img :src="image">
                </div>
                <div style="padding-left: 30px;">
                    <p class="text"> {{job.company_name}}</p>
                    <p class="text jobTitle"> {{job.title}}</p>
                    <p class="text desc">{{job.description}}</p>
                    <p class="text">{{job.location}}</p>
                    <p class="text">{{job.job_enrollment_status}}</p>
                    <b-button @click="deleteJob(job); $event.stopPropagation()" class="applyBtn redBtn" variant="danger">Delete</b-button>
                </div>
              </div>
          </div>
        </div>
    </div>
</template>

<script>

import { Api } from '@/Api'
const image = require('../assets/jobIcon.png')

export default {
  name: 'jobListing',
  data() {
    return {
      jobsData: this.getJobs,
      image
    }
  },
  created() {
    this.getJobs()
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
    },
    handleClick(job) {
      this.$router.push(`/application/${job._id}`)
    },
    deleteJob(job) {
      Api.delete(`/v1/jobs/${job._id}`)
        .then(response => {
          this.jobsData = this.jobsData.filter(item => item._id !== job._id)
        })
        .catch(error => {
          this.message = error
        })
    },
    deleteAllJobs() {
      Api.delete('v1/jobs')
        .then(response => {
          this.jobsData = []
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
  margin: 20px;
  background-color: white;
  border: 2px solid #ccc;
  border-radius: 10px;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  padding: 20px;
}

.hover :hover {
  border-color: rgb(202, 213, 247);
  box-shadow: 0 0 5px rgb(202, 213, 247);
}

.hover :hover:not(.hover) {
  border-color: rgb(18, 33, 78);
  box-shadow: none;
}

.media-left {
  display: flex;
  align-items: center;
}

.content {
  width: 30%;
  flex-direction: column;
}

.content {
  color: black;
  text-decoration: none;
  display: flex;
  align-items: flex-start;
}

.text {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  min-width: 70vh;
  margin: 0;
  text-align: left;
}
.jobTitle {
  font-weight: 600;
  font-size: 24px;
}
.desc {
  color: grey;
  font-weight: 100;
  align-content: flex-end;
}

.redBtn {
  background-color: rgb(229, 182, 182);
  width: 200px;
  border: none;
  margin-left: 20px;
}
.alert-top {
  position: fixed;
  top: 85vh;
  left: 24px;
  right: 0;
  z-index: 1000;
  max-width: 400px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>