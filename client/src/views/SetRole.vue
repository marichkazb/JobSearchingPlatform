<template>
  <b-container fluid class="container-fluid" v-if="!role">
    <h2 class="mt-4">Are you a Company or a Candidate?</h2>
    <b-button @click="chooseRole('candidate')" variant="primary" class="mt-2 mb-2 mr-2"
      >Candidate</b-button
    >
    <b-button @click="chooseRole('company')" variant="primary" class="mt-2 mb-2"
      >Company</b-button
    >

    <div v-if="showCandidateForm" class="text-center">
      <h3 class="mt-5">Enter Candidate Details</h3>
      <b-form @submit.prevent="submitCandidateForm" class="m-5 p-4 bg-light rounded containerStyle">

        <b-form-group label="Name:" label-for="candidateName">
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
          <b-form-input v-model="candidateForm.about" id="about" style="height: 80px !important;"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>

    <div v-if="showCompanyForm" class="text-center">
      <h3 class="mt-5">Enter Company Details</h3>
      <b-form @submit.prevent="submitCompanyForm" class="m-5 p-4 bg-light rounded containerStyle">

        <b-form-group label="Company Name:" label-for="name">
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

        <b-form-group label="Logo URL:" label-for="logo">
          <b-form-input v-model="companyForm.logo" id="logo"></b-form-input>
        </b-form-group>

        <b-form-group label="Company description" label-for="desc">
          <b-form-input v-model="companyForm.desc" id="desc"></b-form-input>
        </b-form-group>

        <b-form-group
          label="Locations (comma separated):"
          label-for="locations"
        >
          <b-form-input
            v-model="companyForm.locations"
            id="locations"
            style="height: 80px !important;"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>
  </b-container>
  <b-col v-else class="mt-5" fluid>
    <h3>{{ userName }}, you are successfully registered!</h3>
    <p>Your role is set to: {{ role }}</p>
    <p>Click a button to redirect to the app.</p>
    <b-button @click="redirectToTheApp" class="mt-3" variant="primary">Go to the app</b-button>
  </b-col>
</template>

<script>
import { Api } from '@/Api';

import {
  getIdToken,
  refreshToken,
  getFirebaseUID,
  getFirebaseMail,
  getFirebaseName,
} from '../../authService';

export default {
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
      if (selectedRole === 'candidate') {
        this.showCandidateForm = true;
        this.showCompanyForm = false;
      } else {
        this.showCompanyForm = true;
        this.showCandidateForm = false;
      }
    },
    async submitCompanyForm() {
      const requestData = {
        name: this.userName,
        email: this.userEmail,
        logo: this.companyForm.logo,
        description: this.companyForm.desc,
        locations: this.companyForm.locations
          .split(',')
          .map((loc) => loc.trim()), // Splitting by comma and trimming
      };

      try {
        const response = await this.postData('/v1/companies', requestData);
        this.role = 'company';
        this.id = response._id;
      } catch (error) {
        console.error('Error submitting company form:', error);
      }
    },
    async submitCandidateForm() {
      const requestData = {
        name: this.userName,
        email: this.userEmail,
        number: this.candidateForm.number,
        education: this.candidateForm.education,
        currentCompany: this.candidateForm.currentCompany,
        linkedin: this.candidateForm.linkedin,
        about: this.candidateForm.about,
      };

      try {
        const response = await this.postData('/v1/candidates', requestData);
        this.role = 'candidate';
        this.id = response._id;
      } catch (error) {
        console.error('Error submitting candidate form:', error);
      }
    },

    async postData(endpoint, requestData) {
      const token = await getIdToken();
      const response = await Api.post(endpoint, requestData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      refreshToken();
      return response.data;
    },
    redirectToTheApp() {
      location.reload(true);
      this.$router.push('/jobListings');
    }
  },
};
</script>

<style scoped>
h2, h3 {
  color: #333;
  text-align: center;  /* Center the text of the headers */
}

.main-container{
  display: flex;
  flex-direction: column;
  align-items: center; /* This ensures that all immediate children are centered */
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  width: 100%;
  max-width: 600px;  /* You can adjust this value */
}

button {
  transition: background-color 0.3s;
}

b-form {
  width: 100%;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input[type="submit"] {
  width: auto;
  margin-top: 20px;
}
.alignCenter {
  max-height: 100rem;
}
.setRoleButtons {
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: row;
  width: 17rem;
  justify-content: space-between;
}
.formStyle {
  width: 40rem;
  margin-top: 30px;
}
.successfulRegistration {
    margin-left: 30%;
    margin-top: 15%;
}
.containerStyle {
  max-width: 600px;
  margin-left: 30% !important;
  margin-right: 30% !important
}
</style>
