<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4 animate-pop-in">Liste des formations</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start animate-pop-in">
        <v-btn outlined rounded color="blue" @click="redirect('/projets')">
          <v-icon class="mr-2">folder</v-icon>Retourner aux projets
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end animate-pop-in">
        <v-btn outlined rounded color="blue" @click="redirect('/intervenants/projets/' + Number($route.params.id))">
          <v-icon class="mr-2">groups</v-icon>Aller au Intervenant
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!formationsByProjet.length">
        <p class="text-center animate-pop-in">Aucune formation sur ce projet</p>
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
export default {
  name: "Formation",
  components: {ReadFormation},

  mounted() {
    this.$store.dispatch('loadFormationProjet', this.$route.params.id);
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