<template>
  <b-container fluid class="container-fluid alignCenter">
    <Alert
      :alertMessage="alertMessage"
      :alertId="alertId"
      :getVariant="variant"
    />
        <div v-if="!formSubmitted">

    <b-row class="text-center mt-4">
        <b-col>
          <h2>Are you a Company or a Candidate?</h2>
          <b-button
            @click="chooseRole('candidate')"
            variant="primary"
            class="mr-2"
            >Candidate</b-button
          >
          <b-button @click="chooseRole('company')" variant="primary"
            >Company</b-button
          >
        </b-col>
      </b-row>
      </div>
    <div v-if="role && !formSubmitted">
      <b-row class="text-center mt-5">
        <b-col>
          <h3>
            Enter {{ role === "company" ? "Company" : "Candidate" }} Details
          </h3>
        </b-col>
      </b-row>

      <b-row class="justify-content-md-center mt-3">
        <b-col md="6">
          <b-form
            @submit.prevent="submitForm"
            class="p-4 bg-light rounded formStyle"
          >
            <!-- Common Fields -->
            <b-form-group
              :label="role === 'company' ? 'Company Name:' : 'Name:'"
              label-for="name"
            >
              <b-form-input v-model="userName" id="name"></b-form-input>
            </b-form-group>
            <b-form-group label="Email:" label-for="email">
              <b-form-input
                v-model="userEmail"
                id="email"
                type="email"
                readonly
              ></b-form-input>
            </b-form-group>
            <!-- Candidate Specific Fields -->
            <template v-if="role === 'candidate'">
              <b-form-group label="Number:" label-for="number">
                <b-form-input
                  v-model="candidateForm.number"
                  id="number"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Education:" label-for="education">
                <b-form-input
                  v-model="candidateForm.education"
                  id="education"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Current Company:" label-for="currentCompany">
                <b-form-input
                  v-model="candidateForm.currentCompany"
                  id="currentCompany"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="LinkedIn:" label-for="linkedin">
                <b-form-input
                  v-model="candidateForm.linkedin"
                  id="linkedin"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="About:" label-for="about">
                <b-form-input
                  v-model="candidateForm.about"
                  id="about"
                  style="height: 80px !important"
                ></b-form-input>
              </b-form-group>
            </template>

            <!-- Company Specific Fields -->
            <template v-if="role === 'company'">
              <b-form-group label="Company description" label-for="desc">
                <b-form-input
                  v-model="companyForm.desc"
                  id="desc">
                </b-form-input>
              </b-form-group>
              <b-form-group label="Logo URL:" label-for="logo">
                <b-form-input
                  v-model="companyForm.logo"
                  id="logo"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Locations (comma separated):"
                label-for="locations"
              >
                <b-form-input
                  v-model="companyForm.locations"
                  id="locations"
                  style="height: 80px !important"
                ></b-form-input>
              </b-form-group>
            </template>

            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>

    <b-col class="mt-5" fluid> </b-col>
  </b-container>
</template>

<script>
import { Api } from '@/Api';
import Alert from '../components/Alert.vue';

import {
  getIdToken,
  refreshToken,
  getFirebaseUID,
  getFirebaseMail,
  getFirebaseName,
} from '../../authService';

export default {
  name: 'setRole',
  components: {
    Alert,
  },
  data() {
    return {
      role: null,
      id: null,
      showCandidateForm: false,
      showCompanyForm: false,
      companyForm: {
        name: getFirebaseName(),
        email: getFirebaseMail(),
      },
      candidateForm: {
        name: getFirebaseName(),
        email: getFirebaseMail(),
      },
      userEmail: null,
      userName: null,
      userId: null,
      alertMessage: undefined,
      alertId: undefined,
      variant: undefined,
      formSubmitted: false,
    };
  },
  async created() {
    try {
      this.userName = await getFirebaseName();
      this.userEmail = await getFirebaseMail();
      this.userId = await getFirebaseUID();
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  },
  methods: {
    async chooseRole(selectedRole) {
      this.role = selectedRole;
    },
    async submitForm() {
      let endpoint;
      let requestData;

      if (this.role === 'candidate') {
        endpoint = '/v1/candidates';
        requestData = {
          name: this.userName,
          email: this.userEmail,
          number: this.candidateForm.number,
          education: this.candidateForm.education,
          currentCompany: this.candidateForm.currentCompany,
          linkedin: this.candidateForm.linkedin,
          about: this.candidateForm.about,
        };
      } else if (this.role === 'company') {
        endpoint = '/v1/companies';
        requestData = {
          name: this.userName,
          email: this.userEmail,
          description: this.companyForm.desc,
          logo: this.companyForm.logo,
          locations: (this.companyForm.locations || '')
            .split(',')
            .map((loc) => loc.trim()) // Splitting by comma and trimming
            .filter((loc) => loc !== ''), // Remove any empty strings
        };
      }

      try {
        const response = await this.postData(endpoint, requestData);
        this.id = response._id;
        setTimeout(() => {
          location.reload(true);
        }, 2000);
      } catch (error) {
        console.error(`Error submitting ${this.role} form:`, error);
      }
    },
    async postData(endpoint, requestData) {
      try {
        const token = await getIdToken();
        const response = await Api.post(endpoint, requestData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        this.alertMessage = `${this.userName}, you are successfully registered! You will be forwarded shortly.`;
        this.variant = 'success';
        this.alertId = Math.random();
        this.formSubmitted = true;
        refreshToken();
        return response.data;
      } catch (error) {
        console.error('Error posting data:', error);
        this.alertMessage =
          'Something went wrong. Please make sure you have filled all the required fields.';
        this.variant = 'danger';
        this.alertId = Math.random();
        this.formSubmitted = false;
      }
    },
    redirectToTheApp() {
      location.reload(true);
      this.$router.push('/jobListings');
    },
  },
};
</script>

<style scoped>
h2,
h3 {
  color: #333;
  text-align: center; /* Center the text of the headers */
}

.formStyle {
  width: 100%;
  margin-top: 30px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  transition: background-color 0.3s;
}

.containerStyle {
  max-width: 600px;
}
</style>
