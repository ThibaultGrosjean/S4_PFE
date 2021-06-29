<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4 animate-pop-in">Liste des statuts</h1>
      </v-col>
    </v-row>
    <v-row
        align="center"
        justify="center"
    >
      <v-btn-toggle
          v-if="statuts.length"
          borderless
          rounded
          dense
          mandatory
          color="blue--text text--accent-4"
          class="animate-pop-in"
      >
        <v-btn
            @click="sortedByNom"
        >
          <span class="hidden-sm-and-down">Nom</span>
          <v-icon right>sort_by_alpha</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row>
      <v-col v-if="!statuts.length">
        <p class="text-center animate-pop-in">Aucune donnée trouvée</p>
      </v-col>
    </v-row>
    <v-row>
      <ReadStatuts :statuts="statuts"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadStatuts from "../components/ReadStatuts";
import {mapState} from "vuex";
export default {
  name: "Statuts",
  components: {ReadStatuts},

  data: () => ({
    sortNom: false,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'statuts');
  },
  computed: {
    ...mapState(['statuts', 'enseignants']),
  },
  methods: {
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false
        this.statuts.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase())
      } else {
        this.sortNom = true
        this.statuts.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase())
      }
    },
  }
}
</script>

<style scoped>

</style>