<template>
  <div>
    <div class="left-column custom-left-align">
      <h2>About</h2>
      <p>{{company.description}}</p>
      <h2>Recent Job Openings</h2>
      <div class="col-sm-6">
        <div class="card mb-4">
          <div class="card-body box tex-white rounded">
            <h5 v-for="jobId in company.jobs" :key="jobId" class="card-title">{{jobDetails[jobId].title}}</h5>
        <h4 v-for="jobId in company.jobs" :key="jobId" class="text-colour">{{jobDetails[jobId].description}}</h4>
        <h5 v-for="jobId in company.jobs" :key="jobId" class="text-muted">Deadline: {{jobDetails[jobId].deadline}}</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="right-column custom-left-align">
      <p>{{company.logo}}</p>
      <div class="col-sm-12 mb-3 mb-4">
      <div class="card custom-blue-border">
        <div class="card-body">
       <p>Name: {{ company.name }}</p>
       <p>Email: {{company.email}}</p>
       <p>Location: {{company.locations}}</p>
        </div>
        </div>
      </div>
      <div class="col-md-12 mt-4">
        <b-button v-if="!editMode" @click="startEdit">Edit</b-button>
        <b-button v-else @click="saveEdit">Save</b-button>
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
      editMode: false,
      editedDescription: '',
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
      // Fetch job details for each job ID
      const token = await getIdToken();
      for (const jobId of this.company.jobs) {
        Api.get(`/v1/jobs/${jobId}`, {
          headers: {
            Authorization: `${token}`, // Use this.token to access the token
          },
        })
          .then((response) => {
            const job = response.data;
            job.deadline = new Date(job.deadline).toDateString()
            this.$set(this.jobDetails, jobId, job);
          })
          .catch((error) => {
            this.message = error.response.data;
          });
      }
    },
    getJobTitle(jobId) {
      return this.jobDetails[jobId] || 'Loading...';
    },
    startEdit() {
      this.editMode = true;
      this.editedDescription = this.company.description;
    },
    async saveEdit() {
      this.editMode = false;
      const updatedCompanyData = {
        description: this.editedDescription,
        name: this.editedName,
        email: this.editedEmail,
        location: this.editedLocation,
      }
      const token = await getIdToken();
      Api.put(`/v1/companies/${this.companyId}`, updatedCompanyData,)
      Api.patch(`/v1/companies/${this.companyId}`, updatedCompanyData, {
        headers: {
          Authorization: `${token}`,
        }
      })
        .then((response) => {
          console.log('Company details updated:', response);
        })
        .catch((error) => {
          console.error('Error updating company details:', error);
        })
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
