<template>
  <v-container fill-height fluid class="pa-10 background-shape">
    <v-row>
      <v-btn link icon large color="primary" class="accueil" @click="$router.push('/')">
        <v-icon large>home</v-icon>
      </v-btn>
    </v-row>
    <v-row align="center" justify="center" class="text-center">
      <v-col class="pa-0 animate-pop-in">
        <div class="title404">404</div>
        <div class="text-h2">Page non trouvée...</div>
        <div class="grey--text mt-4 subtitle404">La page à laquelle vous essayez d'accéder n'existe pas.</div>
        <div class="mt-12 subtitle404">Essayez de revenir à la page d'accueil et de répéter votre action.</div>
        <div class="mt-5">
          <v-btn link text color="primary" @click="$router.push('/')">
            <v-icon class="mr-2">home</v-icon>
            Retourner à l'accueil
          </v-btn>
        </div>
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
  font-size: 1.2em;
}

.background-shape {
  background: #eef0f4 !important;
  background: linear-gradient(153deg, #25293a 18%, #eef0f4 18%) no-repeat bottom !important;
  color: #25293a;
}

.accueil {
  top: 0;
  left: 0;
  position: fixed !important;
  margin: 26px;
  z-index: 1000;
}
</style>