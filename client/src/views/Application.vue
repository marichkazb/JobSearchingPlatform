<template>
    <div class="wrapperApplication">
        <p class="title">Job Application</p>
        <div class="inputContainer">
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
                v-model="file1"
                class="input"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                ></b-form-file>
             <b-button @click="postApplication()" class="applyBtn">Apply</b-button>
        </div>
        <div>
  </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  name: 'application',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      linkedIn: '',
      motivation: '',
      errors: '',
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
        if (!field.value) {
          this.errors[field.id] = `${field.placeholder} is required`
        } else {
          requestData[field.id] = field.value
        };
      })
      if (Object.keys(this.errors).length === 0) {
        Api
          .post(`/v1/jobs/${this.id()}/applications`, requestData)
          .then(response => {
            console.log('Response from server:', response.data)
            this.$router.go(-1)
          })
          .catch(error => {
            this.message = error.response.data
          })
      }
    },
    id() {
      return this.$route.params.id
    }
  }
}
</script>

<style scoped>
.btn_message {
  margin-bottom: 1em;
}
.wrapperApplication {
    margin: 32px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}
.input {
    margin: 16px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.02);
}
.motivation {
    height: 100px;
}
.inputContainer {
    width: 70%
}
.applyBtn {
    background-color:rgba(7, 25, 82, 1);
    width: 248px;
    height: 56px;
}
</style>
