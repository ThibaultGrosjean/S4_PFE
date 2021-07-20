<template>
  <v-container fluid class="pa-10">
    <v-row>
      <v-col>
        <h1 class="text-center text-h4 animate-pop-in">Accueil</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Accueil',
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      await this.$router.push('/connexion');
    }
  },
}
</script>
