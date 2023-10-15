<template>
  <b-container fluid>
    <b-row class="mt-5">
      <b-col>
        <h4 class="title">Job Applications</h4>
      </b-col>
    </b-row>

    <b-row class="containerApplication">
      <b-col v-if="applicationsData.length === 0" id="emptyState" class="m-5">
        <h4>There are no applications for this job yet.</h4>
      </b-col>
      <b-col v-for="application in applicationsData" :key="application._id" md="4" sm="6" xs="12" class="maxWidth">
        <b-card no-body class="applicationWrapper m-2 mb-3">
          <b-row class="m-0 pl-2">
            <b-col xs="8" md="10" class="p-4">
              <b-card-text class="text oneLine name">{{ application.firstName + ' ' +  application.lastName }}</b-card-text>
              <b-card-text class="text oneLine email">{{application.email}}</b-card-text>
              <b-card-text class="text oneLine">{{application.linkedIn}}</b-card-text>
              <b-card-text class="text mt-2 motivation">Motivation: {{application.motivation}}</b-card-text>
              <b-card-text class="text oneLine status mt-3">{{application.status}}</b-card-text>
              <b-button v-if="application.resumeUrl" variant="primary" class="mt-4">
                <a :href="application.resumeUrl" target="_blank" style="color: white;">Open CV</a>
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import { Api } from '@/Api'
import { getIdToken } from '../../authService';
import { auth } from '../../firebaseInit';

const defaultImage = require('../assets/defaultCompanyLogo.png')

export default {
  name: 'JobApplications',
  data() {
    return {
      applicationsData: this.getApplications,
      userType: 'user',
      jobId: this.$route.params.id,
      defaultImage
    }
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserType()
      }
    });
    await this.getApplications()
  },
  methods: {
    async getApplications() {
      try {
        const token = await getIdToken();
        const response = await Api.get(`/v1/jobs/${this.jobId}/applications`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        // Array of Promises
        const applicationPromises = response.data.map(async (application) => {
          if (application.resume) {
            const dataUrl = `data:application/pdf;base64,${application.resume}`;
            const res = await fetch(dataUrl);
            const blob = await res.blob();

            const objectURL = URL.createObjectURL(blob);
            // Set the new property on the application.
            return {
              ...application,
              resumeUrl: objectURL
            };
          }
          return application; // if no resume, return the unchanged object
        });

        // Waiting for all the promises to resolve before setting the data.
        this.applicationsData = await Promise.all(applicationPromises);
      } catch (error) {
        console.error('An error occurred:', error);
        this.message = error.message || 'Error while fetching applications';
      }
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
          this.getApplications(this.userType)
        })
        .catch(error => {
          this.message = error
        })
    }
  },
  beforeDestroy() {
  // Release the object URLs to free up memory.
    if (this.applicationsData) {
      this.applicationsData.forEach(application => {
      // Checking if the application has a resumeUrl before revoking.
        if (application.resumeUrl) {
          URL.revokeObjectURL(application.resumeUrl);
        }
      });
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.containerApplication {
  margin-top: 24px;
}

.applicationWrapper {
  border-radius: 10px;
  transition: all 0.3s;
}
.maxWidth {
  max-width: 60%;
}
.text {
  margin: 0;
  text-align: left;
  font-size: 16px;
}
.name {
  font-weight: bold;
  font-size: 24px;
}
.oneLine {
  /* Ensures no more than 1 line. Truncates if more.*/
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.motivation {
  font-style: italic;
  font-size: 14px;
}
.status {
  background-color: rgb(0 123 255 / 26%);
  color: rgba(7, 25, 82, 1);
  padding: 4px 10px;
  border-radius: 20px;
  width: fit-content;
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
</style>
