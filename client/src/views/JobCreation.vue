<template>
  <div class="pageWrapper center">
    <h1>Create a Job</h1>
    <div v-if="!formSubmitted">
      <div class="row">
        <!-- Left Column -->
        <div class="col-md-6 inputContainer">
          <div v-for="(field, index) in inputFields" :key="index" class="mb-3">
            <!-- Show the first 8 input fields on the left -->
           <b-form-input
  v-model="field.value"
  :class="field.class"
  :placeholder="field.placeholder"
  :state="errors[field.id] ? false : null"
  v-if="index < 8"></b-form-input>
            <div class="text-danger" v-if="errors[field.id]">{{ errors[field.id] }}</div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-6 inputContainer">
          <div v-for="(field, index) in inputFields" :key="index" class="mb-3">
            <!-- Show the last 7 input fields on the right -->
            <b-form-input
              v-model="field.value"
              :class="field.class"
              :placeholder="field.placeholder"
              :state="errors[field.id] ? false : null"
              v-if="index >= 8"></b-form-input>
            <div class="text-danger" v-if="errors[field.id]">{{ errors[field.id] }}</div>
          </div>
        </div>
      </div>

      <b-button @click="postJob()" class="submitBtn" variant="primary">Submit</b-button>
    </div>

    <div v-else>
      <div class="textOnSubmission">
        Job is successfully created
      </div>
      <b-button @click="goBack()" class="backBtn" variant="primary">Go Back</b-button>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { getIdToken } from '../../authService'

export default {
  name: 'jobCreation',
  data() {
    return {
      title: '',
      company_name: '',
      description: '',
      skills: '',
      validation: '',
      yearly_salary_min: '',
      yearly_salary_max: '',
      location: '',
      date_posted: Date.now(),
      deadline: '',
      job_level: '',
      education_level: '',
      job_status: '',
      job_enrollment_status: '',
      motivation: '',
      errors: '',
      alertMessage: undefined,
      alertId: undefined,
      variant: undefined,
      companyId: null,
      formSubmitted: false,
      inputFields: [
        {
          id: 'title',
          value: '',
          class: 'input',
          placeholder: 'Job Title'
        },
        {
          id: 'company_name',
          value: '',
          class: 'input',
          placeholder: 'Company Name'
        },
        {
          id: 'description',
          value: '',
          class: 'input',
          placeholder: 'Description'
        },
        {
          id: 'skills',
          value: '',
          class: 'input',
          placeholder: 'Skills'
        },
        {
          id: 'validation',
          value: '',
          class: 'input',
          placeholder: 'Validation'
        },
        {
          id: 'yearly_salary_min',
          value: '',
          class: 'input',
          placeholder: 'Minimum Yearly Salary'
        },
        {
          id: 'yearly_salary_max',
          value: '',
          class: 'input',
          placeholder: 'Maximum Yearly Salary'
        },
        {
          id: 'location',
          value: '',
          class: 'input',
          placeholder: 'Location'
        },
        {
          id: 'date_posted',
          value: '',
          class: 'input',
          placeholder: 'Date of Creation'
        },
        {
          id: 'deadline',
          value: '',
          class: 'input',
          placeholder: 'Deadline for Applications'
        },
        {
          id: 'job_level',
          value: '',
          class: 'input',
          placeholder: 'Job Level'
        },
        {
          id: 'education_level',
          value: '',
          class: 'input',
          placeholder: 'Education Level'
        },
        {
          id: 'job_status',
          value: '',
          class: 'input',
          placeholder: 'Job Status'
        },
        {
          id: 'job_enrollment_status',
          value: '',
          class: 'input',
          placeholder: 'Job Enrollment Status'
        }
      ]
    }
  },
  methods: {
    postJob() {
      this.errors = {}
      const requestData = {}
      this.inputFields.forEach((field) => {
        if (field.id !== 'motivation' && !field.value) {
          this.errors[field.id] = `${field.placeholder} is required`
        } else {
          requestData[field.id] = field.value
        };
      })
      if (Object.keys(this.errors).length === 0) {
        Api
          .post(`/v1/companies/${this.companyId}/jobs`, requestData)
          .then(response => {
            this.alertMessage = 'Successfully posted a job'
            this.variant = 'success'
            this.formSubmitted = true
          })
          .catch(error => {
            this.alertMessage = error.response.data
            this.variant = 'danger'
          })
      } else {
        this.alertMessage = 'Something went wrong.. Please, fill all the required fields to proceed'
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    async getUserType() {
      const token = await getIdToken()
      Api.get('/v1/getUserType', {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          this.userType = response.data.userType
          this.companyId = response.data.companyId
          this.getJobs(this.userType)
          localStorage.setItem('userType', this.userType)
        })
        .catch(error => {
          this.message = error
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
.inputContainer {
    width: 30%
}
.submitBtn {
    background-color:rgba(7, 25, 82, 1);
    width: 248px;
    height: 56px;
}
.backBtn {
    background-color:rgba(7, 25, 82, 1);
    width: 130px;
    height: 40px;
}
.textOnSubmission {
  font-size: 24px;
  margin-top: 70px;
  margin-bottom: 20px;
}
.center {
  align-items: center;
}
#jobCreationTitle {
  margin-right: 300px;
  align-self: auto;
}
</style>
