<template>
  <div>
    <div v-if="!isEditing">
    <div class="left-column custom-left-align">
      <h2>About</h2>
      <p>{{company.description}}</p>
      <h2 class="mt-6">Recent Job Openings</h2>
      <div class="col-sm-6 mt-4">
        <div class="card mb-4">
          <div class="card-body box tex-white rounded" v-for="jobId in company.jobs" :key="jobId">
            <div @click="onClick(jobId)">
              <h5 v-for="jobId in company.jobs" :key="jobId" class="text-white">{{jobDetails[jobId].title}}</h5>
              <h5 v-for="jobId in company.jobs" :key="jobId" class="text-muted">Location: {{ jobDetails[jobId].location }}</h5>
              <h5 v-for="jobId in company.jobs" :key="jobId" class="text-colour">Salary: ${{jobDetails[jobId].yearly_salary_min}} - ${{jobDetails[jobId].yearly_salary_max}}</h5>
              <h5 v-for="jobId in company.jobs" :key="jobId" class="text-muted">Deadline: {{jobDetails[jobId].deadline}}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-column custom-left-align">
      <b-img :src="company.logo" alt="logo" id="companyImage" fluid class="company-logo"/>
      <div class="card custom-blue-border">
        <div class="card-body">
       <p class="card-title text-left text-muted">Name</p>
       <p style="font-weight: bold;">{{ company.name }}</p>
       <p class="card-title text-left text-muted">Email</p>
       <p style="font-weight: bold;">{{company.email}}</p>
       <p class="card-title text-left text-muted">Location</p>
       <p style="font-weight: bold;">{{company.locations.join(',')}}</p>
        </div>
      </div>
      <div class="col-md-12 mt-4 edit-btn-container">
          <b-button @click="toggleEdit()" href="#" size="lg" class="editBtn mb-4">Edit</b-button>
        </div>
    </div>
    </div>
    <div v-if="isEditing">
      <div class="centered-form">
        <h2 class="mt-6">Edit Profile</h2>
        <div class="edit-box">
        <h4 class="text-muted">Name</h4>
        <textarea class="wide-textarea" v-model="editedCompany.name" @input="setChangesMade()"></textarea>
        <h4 class="text-muted">Location</h4>
        <textarea class="wide-textarea" v-model="editedCompany.locations" @input="setChangesMade()"></textarea>
        <h4 class="text-muted">Logo</h4>
        <textarea class="wide-textarea" v-model="editedCompany.logo" @input="setChangesMade()"></textarea>
        <h4 class="text-muted">About</h4>
        <textarea class="wide-textarea" v-model="editedCompany.description" @input="setChangesMade()"></textarea>
        <div class="col-md-12 mt-4 edit-btn-container">
          <b-button @click="saveChanges()" size="lg" class="applyBtn mb-4">Save</b-button>
        </div>
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
      editedCompany: {},
      isEditing: false,
      changesMade: false,
      job: null // added
    };
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserType();
      }
    });
  },
  methods: {
    async fetchCompany() {
      if (!this.companyId) {
        return;
      }
      const token = await getIdToken();
      console.log('Token:', token)
      Api.get(`/v1/companies/${this.companyId}`, {
        headers: {
          Authorization: token, // `${token}`
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
    toggleEdit() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editedCompany = { ...this.company };
      }
    },
    setChangesMade() {
      this.changesMade = true;
    },
    async saveChanges() {
      if (this.changesMade) {
        const token = await getIdToken();
        // Send a PUT or PATCH request to update the company details
        const requestMethod = this.changesMade ? 'patch' : 'put';
        Api[requestMethod](`/v1/companies/${this.companyId}`, this.editedCompany, {
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((response) => {
            this.isEditing = false;
            this.fetchCompany();
            this.changesMade = false;
          })
          .catch((error) => {
            this.message = error.response.data;
          });
      } else {
        this.isEditing = false;
      }
    },
    async fetchJobDetails() {
      const token = await getIdToken();
      for (const jobId of this.company.jobs) {
        Api.get(`/v1/jobs/${jobId}`, {
          headers: {
            Authorization: token, // `${token}`
          },
        })
          .then((response) => {
            const job = response.data;
            job.deadline = new Date(job.deadline).toDateString()
            this.$set(this.jobDetails, jobId, job);
            console.log('job:' + this.job);
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
          Authorization: token, // `${token}`
        },
      })
        .then((response) => {
          this.companyId = response.data.companyId;
          console.log('CompanyID: ' + this.companyId) // added
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
.edit-box{
  max-width: 2000px;
  width: 100%;
}
.right-column{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}
.edit-btn-container{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.wide-textarea{
  width: 40%;
}
.input {
  margin: 16px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.02);
}
.custom-left-align {
  text-align: left;
}
.inputContainer {
  width: 50%;
}
.editBtn {
  background-color: rgba(7, 25, 82, 1);
  width: 248px;
  height: 56px;
}
.applyBtn {
  background-color: rgba(7, 25, 82, 1);
  width: 200px;
  height: 56px;
}
.custom-blue-border {
  border: 2px solid rgb(11, 63, 234);
  width: 450px;
  height: 250px;
}
.text-colour {
  color: aquamarine;
}
.box {
  background-color: rgba(7, 25, 82, 1);
  height: 160px;
  padding: 20px;
}
.custom-alert {
  width: 110px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.company-logo{
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
