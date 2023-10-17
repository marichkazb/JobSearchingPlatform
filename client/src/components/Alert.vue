<template>
    <b-alert
        :show="alertMessage && dismissCountDown"
        dismissible
        fade
        :variant="getVariant"
        @dismiss-count-down="countDownChanged"
        class="fixed-top alert-top"
        >
        {{ alertMessage }}
    </b-alert>

</template>

<script>

export default {
  name: 'Alert',
  props: {
    alertMessage: String,
    alertId: Number,
    getVariant: {
      type: String,
      default: 'success'
    }
  },
  data() {
    return {
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  watch: {
    alertId() {
      this.showAlert()
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>

<style scoped>

.alert-top {
  position: fixed;
  top: 85vh;
  left: 24px;
  right: 0;
  z-index: 1000;
  max-width: 400px;
  height: 80px;
  text-align: left;
}

</style>
