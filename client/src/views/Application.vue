<template>
    <div class="pageWrapper center">
        <Alert :alertMessage="alertMessage" :alertId="alertId" :getVariant="variant" />
        <p class="title" id="jobApplicationTitle">Job Application</p>
        <div v-if="!formSubmitted" class="inputContainer">
            <b-form-input
                v-for="(field, index) in inputFields"
                :key="index"
                v-model="field.value"
                :class="field.class"
                :placeholder="field.placeholder"
                :state="errors[field.id] ? false: null"
            >
                <div class="text-danger">
                    {{ errors }}
                </div>
            </b-form-input>
            <b-form-file
                class="input"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                ></b-form-file>
             <b-button @click="postApplication()" class="applyBtn" variant="primary">Apply</b-button>
        </div>
        <div v-else>
            <div class="thankYouText">
              Thank you! Your application is recorded!
            </div>
            <b-button @click="goBack()" class="backBtn" variant="primary">Go Back</b-button>
        </div>
        <div>
  </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import Alert from '../components/Alert.vue'

export default {
  name: 'application',
  components: {
    Alert
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      linkedIn: '',
      motivation: '',
      errors: '',
      alertMessage: undefined,
      alertId: undefined,
      variant: undefined,
      formSubmitted: false,
      inputFields: [
        {
          id: 'firstName',
          value: '', // Initialize with empty values
          class: 'input',
          placeholder: 'First name'
        },
        {
          id: 'lastName',
          value: '',
          class: 'input',
          placeholder: 'Last name'
        },
        {
          id: 'email',
          value: '',
          class: 'input',
          placeholder: 'Email address'
        },
        {
          id: 'linkedIn',
          value: '',
          class: 'input',
          placeholder: 'LinkedIn profile'
        },
        {
          id: 'motivation',
          value: '',
          class: 'input motivation',
          placeholder: 'Briefly describe your work experience and why you would be a good fit for this position..'
        }
      ]
    }
  },
  methods: {
    postApplication() {
      this.errors = {}
      const requestData = {}
      // Perform validation for each field
      this.inputFields.forEach((field) => {
        if (field.id !== 'motivation' && !field.value) {
          this.errors[field.id] = `${field.placeholder} is required`
        } else {
          requestData[field.id] = field.value
        };
      })
      if (Object.keys(this.errors).length === 0) {
        Api
          .post(`/v1/jobs/${this.id()}/applications`, requestData)
          .then(response => {
            this.alertMessage = 'Successfully posted an application'
            this.variant = 'success'
            this.alertId = Math.random()
            this.formSubmitted = true
          })
          .catch(error => {
            this.message = error.response.data
          })
      } else {
        this.alertMessage = 'Something went wrong.. Please, fill all the required fields to proceed'
        this.variant = 'danger'
        this.alertId = Math.random()
      }
    },
    id() {
      return this.$route.params.id
    },
    goBack() {
      this.$router.go(-1)
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
.backBtn {
    background-color:rgba(7, 25, 82, 1);
    width: 130px;
    height: 40px;
}
.thankYouText {
  font-size: 24px;
  margin-top: 70px;
  margin-bottom: 20px;
}
.center {
  align-items: center;
}
#jobApplicationTitle {
  margin-right: 300px;
  align-self: auto;
}
</style>
