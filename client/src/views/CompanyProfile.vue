<template>
  <div>
    <div class="left-column custom-left-align">
      <h2>About</h2>
      <p>{{company.description}}</p>
      <h2>Recent Job Openings</h2>
      <div class="col-sm-6">
        <div class="card mb-4">
          <div class="card-body box tex-white rounded" v-for="jobId in company.jobs" :key="jobId">
            <div @click="onClick(jobId)">
            <h5 v-for="jobId in company.jobs" :key="jobId" class="text-white">{{jobDetails[jobId].title}}</h5>
        <h4 v-for="jobId in company.jobs" :key="jobId" class="text-colour">${{jobDetails[jobId].yearly_salary_min}} - ${{jobDetails[jobId].yearly_salary_max}}</h4>
        <h5 v-for="jobId in company.jobs" :key="jobId" class="text-muted">Deadline: {{jobDetails[jobId].deadline}}</h5>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div class="right-column custom-left-align">
      <p>{{company.logo}}</p>
      <div class="card custom-blue-border">
        <div class="card-body">
       <p>Name: {{ company.name }}</p>
       <p>Email: {{company.email}}</p>
       <p>Location: {{company.locations}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api';
import { getIdToken } from '../../authService';
import { auth } from '../../firebaseInit';

export default {
  name: 'profile',
  data() {
    return {
      company: {
        jobs: []
      },
      companyId: null,
      jobDetails: {},
      token: null,
    };
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserType();
      }
    });
    // this.fetchCompany()
  },
  methods: {
    async fetchCompany() {
      const token = await getIdToken();
      console.log('Token:', token)
      Api.get(`/v1/companies/${this.companyId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then((response) => {
          console.log(response);
          this.company = response.data;
          this.fetchJobDetails();
          console.log(this.company);
        })
        .catch((error) => {
          this.message = error.response.data;
        });
    },
    async fetchJobDetails() {
      const token = await getIdToken();
      for (const jobId of this.company.jobs) {
        Api.get(`/v1/jobs/${jobId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((response) => {
            const job = response.data;
            job.deadline = new Date(job.deadline).toDateString()
            this.$set(this.jobDetails, jobId, job);
            console.log(this.job);
          })
          .catch((error) => {
            this.message = error.response.data;
          });
      }
    },
    getJobTitle(jobId) {
      return this.jobDetails[jobId] || 'Loading...';
    },
    onClick(jobId) { // job-description/:id
      this.$router.push(`/job-description/${jobId}`);
    },
    async getUserType() {
      const token = await getIdToken();
      Api.get('/v1/getUserType', {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then((response) => {
          this.companyId = response.data.companyId;
          this.fetchCompany();
        })
        .catch((error) => {
          this.message = error;
        });
    },
  },
};
</script>

<style scoped>
.left-column{
  width: 50%;
  float: left;
  margin-left: 100px;
  margin-top: 50px;
}
.right-column{
  flex: 1;
  margin-top: 50px;
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
  width: 50%;
}
.applyBtn {
  background-color: rgba(7, 25, 82, 1);
  width: 248px;
  height: 56px;
}
.custom-blue-border {
  border: 2px solid rgb(11, 63, 234);
}
.text-colour {
  color: aquamarine;
}
.box {
  background-color: rgba(7, 25, 82, 1);
  height: 150px;
}
.custom-alert {
  width: 110px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.custom-badge {
  background-color: #ccc;
  color: #333;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 20px;
  display: inline-block;
}
.job-enrollment-badge {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  width: 110px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
