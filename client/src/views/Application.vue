<template>
  <div class="pageWrapper center">
    <Alert :alertMessage="alertMessage" :alertId="alertId" :getVariant="variant" />
    <p class="title mt-5" id="jobApplicationTitle">Job Application</p>
    <div class="applicationContent">
      <div style="display: flex;">
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
            v-model="file1"
            class="input"
            @input="handleFileUpload"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
          <b-button v-if="file1Preview" class="applyBtn mb-4 mr-1" variant="primary">
            <a :href="file1Preview" target="_blank" style="color: white;">Open/Download File</a>
          </b-button>
          <b-button @click="postApplication()" class="applyBtn mb-4" variant="primary">Apply</b-button>
        </div>
        <div v-else>
          <div class="thankYouText">
            Thank you! Your application is recorded!
          </div>
          <b-button @click="goBack()" class="backBtn" variant="primary">Go Back</b-button>
        </div>
      </div>
      <div id="pdf-preview" v-if="file1Preview" class="pdf-preview ml-5" style="display: flex">
        <div class="pdf-preview-content" ref="pdfContent">
          <vue-pdf-embed :source="file1Preview" />
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import Alert from '../components/Alert.vue'
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import { getIdToken } from '../../authService';
export default {
  name: 'application',
  components: {
    Alert,
    VuePdfEmbed
  },
  updated() {
    console.log(this.file1);
  },
  data() {
    return {
      file1: null,
      file1Preview: '',
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
    async postApplication() {
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
        const fd = new FormData();
        fd.append('file', this.file1);
        fd.append('requestData', requestData);
        requestData.pdfFile = fd;
        const token = await getIdToken();
        Api
          .post(`/v1/jobs/${this.id()}/applications`, requestData, {
            headers: {
              Authorization: `${token}`,
            },
          })
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
    },
    handleFileUpload() {
      // Check if a file is selected
      if (this.file1) {
        // Assuming the file is a PDF; you can modify this for other file types
        this.file1Preview = URL.createObjectURL(this.file1);
      } else {
        this.file1Preview = null;
      }
      const element = this.$refs['pdf-preview'];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      if (this.file1) {
        // Scroll down 10 pixels (you can adjust this value as needed)
        window.scrollBy(0, 90);
      }
    },
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
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
  min-width: 600px !important;
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
.pdf-preview {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 400px !important;
}

.pdf-preview-content {
  width: 100%;
  height: 100%;
}
.applicationContent {
  display: flex;
  flex-direction: row;
  max-width: 85%;
  margin-right: 30% !important;
  margin-left: 30% !important;
  justify-content: center;
}
</style>
