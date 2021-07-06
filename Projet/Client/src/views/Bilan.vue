<template>
  <v-container>
    <v-overlay :value="loading" :opacity="0">
      <v-progress-circular
          indeterminate
          size="64"
          color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col class="text-center">
        <h1 class="text-center text-h4 animate-pop-in mb-2">Bilan</h1>
        <span v-if="projet.length" class="text-subtitle-1 animate-pop-in">{{ projet[0].nom + ' - ' + toTime(projet[0].date,4)}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/projets')">
          <v-icon class="mr-2">folder</v-icon>Retourner aux projets
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!bilans.length">
        <p class="text-center animate-pop-in">Aucun bilan sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>
    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success" :rounded="true">
        <span>Le statut a été {{ typeOperation }} avec succès.</span>
        <template v-slot:action="{ attrs }">
          <v-btn
              icon
              v-bind="attrs"
              @click="responseSuccess = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
import apiProjet from "../services/API/projets";

export default {
  name: "Bilan",
  data: () => ({
    bilans: [],
    projet: [],
    loading: false,
    responseSuccess: false,
    typeOperation: 'ajouté',
  }),
  methods: {
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id);
    },
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length);
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    }
  },
  computed: {

  },
  async mounted() {
    this.loading = true;
    await this.getProjet();
    this.loading = false;
  }
}
</script>

<style scoped>

</style>