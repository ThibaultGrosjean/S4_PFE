<template>
  <v-container fill-height fluid class="pa-0">
    <v-row align="center" justify="center" class="text-center">
      <v-col class="pa-0">
        <div class="title404">404</div>
        <div class="text-h2">Page non trouvée...</div>
        <div class="grey--text mt-4 subtitle404">La page à laquelle vous essayez d'accéder n'existe pas.</div>
        <div class="mt-12 subtitle404">Essayez de revenir à la page d'accueil et de répéter votre action.</div>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
export default {
  name: "Erreur404"
}
</script>

<style scoped>
.title404 {
  font-size: 9em;
}

.subtitle404 {
  font-size:1.2em;
}
</style>