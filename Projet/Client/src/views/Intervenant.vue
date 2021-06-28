<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4">Liste des intervenants</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start">
        <v-btn outlined rounded color="blue" @click="redirect('/projets')">
          <v-icon class="mr-2">folder</v-icon>Retourner aux projets
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn outlined rounded color="blue" @click="redirect('/formations/projets/'+ Number($route.params.id))">
          <v-icon class="mr-2">auto_stories</v-icon>Aller aux formation
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!intervenantsByProjet.length">
        <p class="text-center">Aucun intervenant sur ce projet</p>
      </v-col>
    </v-row>
    <v-row>
      <ReadIntervenants :intervenants="intervenantsByProjet"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadIntervenants from "../components/ReadIntervenants";
import {mapState} from "vuex";
export default {
  name: "Intervenant",
  components: {ReadIntervenants},

  mounted() {
    this.$store.dispatch('loadIntervenantsProjet', this.$route.params.id);
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
    }
  }
}
</script>

<style scoped>

</style>