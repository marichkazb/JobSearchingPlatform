<template>
  <div>
    <div v-if="!isEditing">
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
        <h4 v-for="jobId in company.jobs" :key="jobId" class="text-colour">Location: {{ jobDetails[jobId].location }}</h4>
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
      <div class="col-md-12 mt-4">
          <b-button @click="toggleEdit()" href="#" size="lg" class="editBtn mb-4">Edit</b-button>
        </div>
    </div>
    </div>
    <div v-if="isEditing">
      <div class="left-column custom-left-align">
        <h2>Name</h2>
        <textarea v-model="editedCompany.name" @input="setChangesMade()"></textarea>
        <h2>Location</h2>
        <textarea v-model="editedCompany.location" @input="setChangesMade()"></textarea>
        <h2>About</h2>
        <textarea v-model="editedCompany.description" @input="setChangesMade()"></textarea>
        <div class="col-md-12 mt-4">
          <b-button @click="saveChanges()" size="lg" class="applyBtn mb-4">Save</b-button>
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
      changesMade: false
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
    toggleEdit() {
      this.isEditing = !this.isEditing;
      // Initialize the edited company data when entering edit mode
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
        const requestMethod = this.changesMade ? 'patch' : 'put'; // Change to 'PATCH' if necessary
        Api[requestMethod](`/v1/companies/${this.companyId}`, this.editedCompany, {
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((response) => {
            this.isEditing = false; // Disable editing mode
            this.fetchCompany();
            this.changesMade = false; // Refresh the displayed data
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
.editBtn {
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
