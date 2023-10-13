<template>
     <div>
       <h1>Company Profile</h1>
    <div class="row">
      <div class="row card-body box text-white rounded mb-4 col-sm-6">
        <h5 class="card-title">Job Openings</h5>
        <h4 class="text-colour">${{job.yearly_salary_min}} - ${{job.yearly_salary_max}}</h4>
        <h5 class="text-muted">USD</h5>
      </div>
        <div class="row">
      <div class="card-body custom-blue-border col-sm-12 mb-3 mb-4">
        <h5 class="card-title">Name</h5>
        <h5 class="card-title">Email</h5>
         <h5 class="card-title">Locations</h5>
    </div>
        </div>
      </div>
    </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'CompanyProfile',
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
