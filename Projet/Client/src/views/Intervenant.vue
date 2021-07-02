<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1 class="text-h4 animate-pop-in">Liste des intervenants</h1>
        <span v-if="projet.length" class="text-subtitle-1 animate-pop-in">{{ projet[0].nom + ' - ' + toTime(projet[0].date,4)}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/projets')">
          <v-icon class="mr-2">folder</v-icon>Retourner aux projets
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/formations/projets/'+ Number($route.params.id))">
          <v-icon class="mr-2">auto_stories</v-icon>Aller aux formation
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!intervenantsByProjet.length">
        <p class="text-center animate-pop-in">Aucun intervenant sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>
    <v-row>
      <ReadIntervenants/>
    </v-row>
  </v-container>
</template>

<script>
import ReadIntervenants from "../components/ReadIntervenants";
import {mapState} from "vuex";
import axios from "axios";
export default {
  name: "Intervenant",
  components: {ReadIntervenants},

  data: () => ({
    projet: [],
  }),
  mounted() {
    this.$store.dispatch('loadIntervenantsProjet', this.$route.params.id);
    axios.get('/projets/get/'+ this.$route.params.id)
      .then(response => (this.projet = response.data))
    .catch(error => {
      console.log('Erreur : ', error)
    });
  },
  computed: {
    ...mapState(['intervenantsByProjet']),
  },
  methods: {
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length)
    },
    redirect(path) {
      this.$router.push({path: path}).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>