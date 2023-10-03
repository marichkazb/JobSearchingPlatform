<template>
  <!-- Maybe show a loading spinner or a "Logging out..." message here -->
  <div>Logging out...</div>
</template>

<script>
 // Adjust the path as necessary

export default {
  name: 'Logout',
  created() {
    logout().then(() => {
      this.$router.push('/login');
    });
  }
}
</script>
