<template>
  <div v-if="!role">
    <h2>Are you a Company or a Candidate?</h2>
    <button @click="chooseRole('candidate')">Candidate</button>
    <button @click="chooseRole('company')">Company</button>

    <div v-if="showCandidateForm">
      <h3>Enter Candidate Details</h3>
      <form @submit.prevent="submitCandidateForm">
        <div>
          <label for="uid">Unique ID:</label>
          <input v-model="userId" id="uid" readonly />
        </div>
        <div>
          <label for="candidateName">Name:</label>
          <input v-model="userName" id="name" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input v-model="userEmail" id="email" type="email" readonly />
        </div>
        <div>
          <label for="number">Number:</label>
          <input v-model="candidateForm.number" id="number" />
        </div>
        <div>
          <label for="education">Education:</label>
          <input v-model="candidateForm.education" id="education" />
        </div>
        <div>
          <label for="currentCompany">Current Company:</label>
          <input v-model="candidateForm.currentCompany" id="currentCompany" />
        </div>
        <div>
          <label for="linkedin">LinkedIn:</label>
          <input v-model="candidateForm.linkedin" id="linkedin" />
        </div>
        <div>
          <label for="about">About:</label>
          <input v-model="candidateForm.about" id="about" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>

    <div v-if="showCompanyForm">
      <h3>Enter Company Details</h3>
      <form @submit.prevent="submitCompanyForm">
        <div>
          <label for="uid">Unique ID::</label>
          <input v-model="userId" id="uid" readonly />
        </div>
        <div>
          <label for="name">Company Name:</label>
          <input v-model="userName" id="name" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input v-model="userEmail" id="email" type="email" readonly />
        </div>
        <div>
          <label for="logo">Logo URL:</label>
          <input v-model="companyForm.logo" id="logo" />
        </div>
        <div>
          <label for="locations">Locations (comma separated):</label>
          <input v-model="companyForm.locations" id="locations" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p>Your role is set to: {{ role }}</p>
    <p>Your MongoDB id is set to: {{ id }}</p>
  </div>
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
  },
};
</script>

<style scoped>
h2,
h3 {
  color: #333;
  margin-bottom: 20px;
}

div {
  display: flex;
  max-height: 90vh;
  flex-direction: column;
  align-items: center;
  overflow-y: auto
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

/* Role selection styling */
button + button {
  margin-left: 10px;
}

/* Form styling */
form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  border-radius: 8px;
  margin-top: 20px;
}

form div {
  margin-bottom: 15px; /* Space between each form field */
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
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
</style>
