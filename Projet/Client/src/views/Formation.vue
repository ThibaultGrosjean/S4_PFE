<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1 class="text-h4 animate-pop-in">Liste des formations</h1>
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
        <v-btn outlined rounded color="primary" @click="redirect('/intervenants/projets/' + Number($route.params.id))">
          <v-icon class="mr-2">groups</v-icon>Aller au Intervenant
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!formationsByProjet.length">
        <p class="text-center animate-pop-in">Aucune formation sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>
    <v-row>
      <ReadFormation :formations="formationsByProjet"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadFormation from "../components/ReadFormation";
import {mapState} from "vuex";
import axios from "axios";
export default {
  name: "Formation",
  components: {ReadFormation},

  data: () => ({
    projet: [],
  }),
  mounted() {
    this.$store.dispatch('loadFormationProjet', this.$route.params.id);
    axios.get('/projets/get/'+ this.$route.params.id)
      .then(response => (this.projet = response.data))
    .catch(error => {
      console.log('Erreur : ', error)
    });
  },
  computed: {
    ...mapState(['formationsByProjet']),
  },
  methods: {
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length)
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    }
  }
}
</script>

<style scoped>

</style>